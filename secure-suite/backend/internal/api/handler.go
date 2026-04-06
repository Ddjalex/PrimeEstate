package api

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"secure-suite/backend/internal/models"
	"secure-suite/backend/internal/storage"
)

type Handler struct {
	repo storage.Repository
}

func NewHandler(repo storage.Repository) *Handler {
	return &Handler{repo: repo}
}

func (h *Handler) Router() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/health", h.health)
	mux.HandleFunc("/api/campaigns", h.campaigns)
	mux.HandleFunc("/api/events", h.createEvent)
	mux.HandleFunc("/api/events/", h.listEvents)
	return mux
}

func (h *Handler) health(w http.ResponseWriter, _ *http.Request) {
	jsonResponse(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (h *Handler) campaigns(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		h.listCampaigns(w, r)
	case http.MethodPost:
		h.createCampaign(w, r)
	default:
		jsonResponse(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
	}
}

func (h *Handler) createCampaign(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		ID           string `json:"id"`
		Name         string `json:"name"`
		TargetTeam   string `json:"targetTeam"`
		ConsentProof string `json:"consentProof"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		jsonResponse(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}

	if payload.ConsentProof == "" {
		jsonResponse(w, http.StatusBadRequest, map[string]string{"error": "consentProof is required"})
		return
	}

	campaign := models.Campaign{
		ID:           payload.ID,
		Name:         payload.Name,
		TargetTeam:   payload.TargetTeam,
		ConsentProof: payload.ConsentProof,
		LaunchDate:   time.Now().UTC(),
	}

	if err := h.repo.CreateCampaign(campaign); err != nil {
		jsonResponse(w, http.StatusConflict, map[string]string{"error": err.Error()})
		return
	}

	jsonResponse(w, http.StatusCreated, campaign)
}

func (h *Handler) listCampaigns(w http.ResponseWriter, _ *http.Request) {
	jsonResponse(w, http.StatusOK, h.repo.ListCampaigns())
}

func (h *Handler) createEvent(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		jsonResponse(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}
	var payload struct {
		CampaignID string `json:"campaignId"`
		Type       string `json:"type"`
		Actor      string `json:"actor"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		jsonResponse(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}
	if payload.CampaignID == "" || payload.Type == "" {
		jsonResponse(w, http.StatusBadRequest, map[string]string{"error": "campaignId and type are required"})
		return
	}

	event := models.Event{
		CampaignID: payload.CampaignID,
		Type:       payload.Type,
		Actor:      payload.Actor,
		OccurredAt: time.Now().UTC(),
	}
	_ = h.repo.StoreEvent(event)
	jsonResponse(w, http.StatusCreated, event)
}

func (h *Handler) listEvents(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		jsonResponse(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}
	campaignID := strings.TrimPrefix(r.URL.Path, "/api/events/")
	if campaignID == "" {
		jsonResponse(w, http.StatusBadRequest, map[string]string{"error": "campaignId is required"})
		return
	}
	jsonResponse(w, http.StatusOK, h.repo.ListEvents(campaignID))
}

func jsonResponse(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}
