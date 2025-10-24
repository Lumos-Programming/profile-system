package config

import (
	"os"

	"gopkg.in/yaml.v3"
)

type Config struct {
	Port      int       `yaml:"port"`
	Firestore Firestore `yaml:"firestore"`
}

type Firestore struct {
	ProjectID   string `yaml:"project_id"`
	Credentials string `yaml:"credentials"`
}

// type authを作成し、secretフィールドを追加
type Auth struct {
	JWTSecret string `yaml:"jwt_secret"`
}

const configPath = "../secrets/config.sample.yaml"

func Load() (*Config, error) {
	file, err := os.Open(configPath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var config Config
	if err := yaml.NewDecoder(file).Decode(&config); err != nil {
		return nil, err
	}
	return &config, nil
}
