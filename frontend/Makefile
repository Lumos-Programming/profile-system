# Makefile for generating Next.js client from OpenAPI spec

# Path to OpenAPI spec
OPENAPI_SPEC := ../openapi.yaml

# Output directory for generated client code
OUTPUT_DIR := src/lib/api

# OpenAPI Generator CLI command
GENERATOR := pnpm dlx @openapitools/openapi-generator-cli

# Output subdirectories for APIs and models
API_PACKAGE := apis
MODEL_PACKAGE := models

# Generator options
GENERATOR_OPTS := \
  -i $(OPENAPI_SPEC) \
  -g typescript-axios \
  -o $(OUTPUT_DIR) \
  --additional-properties=supportsES6=true,withSeparateModelsAndApi=true,modelPropertyNaming=camelCase,apiPackage=$(API_PACKAGE),modelPackage=$(MODEL_PACKAGE)

.PHONY: all generate-client clean

all: generate-client

generate-client:
	$(GENERATOR) generate $(GENERATOR_OPTS)

clean:
	rm -rf $(OUTPUT_DIR)
