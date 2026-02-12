package config

import (
	"os"

	"github.com/joho/godotenv"
	"gopkg.in/yaml.v3"
)

type Config struct {
	Port      int       `yaml:"port"`
	Firestore Firestore `yaml:"firestore"`
	LINE      LINE      `yaml:"line"`
}

type Firestore struct {
	ProjectID   string `yaml:"project_id"`
	Credentials string `yaml:"credentials"`
}

type LINE struct {
	ChannelID     string `yaml:"channel_id"`
	ChannelSecret string `yaml:"channel_secret"`
	RedirectURI   string `yaml:"redirect_uri"`
	State         string `yaml:"state"`
}



// type authを作成し、secretフィールドを追加
type Auth struct {
	JWTSecret string `yaml:"jwt_secret"`
}

var configPath = "../secrets/config.yaml"

func Load() (*Config, error) {
	_ = godotenv.Load()
	envConfigPath := os.Getenv("CONFIG_PATH")
	if envConfigPath != "" {
		configPath = envConfigPath
	}

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
