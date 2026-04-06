package models

import "time"

// Campaign models opt-in, legal security-awareness simulations only.
type Campaign struct {
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	TargetTeam   string    `json:"targetTeam"`
	LaunchDate   time.Time `json:"launchDate"`
	ConsentProof string    `json:"consentProof"`
}

type Event struct {
	CampaignID string    `json:"campaignId"`
	Type       string    `json:"type"`
	Actor      string    `json:"actor"`
	OccurredAt time.Time `json:"occurredAt"`
}
