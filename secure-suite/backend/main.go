package main

import (
	"log"
	"net/http"
	"time"

	"secure-suite/backend/internal/api"
	"secure-suite/backend/internal/storage"
)

func main() {
	repo := storage.NewInMemoryRepository()
	handler := api.NewHandler(repo)

	srv := &http.Server{
		Addr:              ":8081",
		Handler:           handler.Router(),
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Println("Defensive simulation backend listening on :8081")
	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("server error: %v", err)
	}
}
