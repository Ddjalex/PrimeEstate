FROM golang:1.22-alpine
WORKDIR /app
COPY . .
RUN go mod tidy
EXPOSE 8081
CMD ["go", "run", "."]
