# Object Storage Module (S3 / MinIO)

## Responsibilities
- Generates short-lived, pre-signed upload URLs for audio recordings and documents.
- Validates file sizes (Max 10MB for audio, 25MB for PDF) and MIME types.
- Generates secure pre-signed download streaming URLs with 15-minute expiration.
- Zero public access to storage buckets.

