package storage

import (
	"errors"
	"sync"

	"secure-suite/backend/internal/models"
)

type Repository interface {
	CreateCampaign(c models.Campaign) error
	ListCampaigns() []models.Campaign
	StoreEvent(e models.Event) error
	ListEvents(campaignID string) []models.Event
}

type InMemoryRepository struct {
	mu        sync.RWMutex
	campaigns []models.Campaign
	events    []models.Event
}

func NewInMemoryRepository() *InMemoryRepository {
	return &InMemoryRepository{}
}

func (r *InMemoryRepository) CreateCampaign(c models.Campaign) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	for _, existing := range r.campaigns {
		if existing.ID == c.ID {
			return errors.New("campaign already exists")
		}
	}
	r.campaigns = append(r.campaigns, c)
	return nil
}

func (r *InMemoryRepository) ListCampaigns() []models.Campaign {
	r.mu.RLock()
	defer r.mu.RUnlock()
	out := make([]models.Campaign, len(r.campaigns))
	copy(out, r.campaigns)
	return out
}

func (r *InMemoryRepository) StoreEvent(e models.Event) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.events = append(r.events, e)
	return nil
}

func (r *InMemoryRepository) ListEvents(campaignID string) []models.Event {
	r.mu.RLock()
	defer r.mu.RUnlock()
	out := make([]models.Event, 0)
	for _, e := range r.events {
		if e.CampaignID == campaignID {
			out = append(out, e)
		}
	}
	return out
}
