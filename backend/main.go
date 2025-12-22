package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	ConnectDatabase()

	app := fiber.New()
	app.Use(cors.New())

	app.Get("/api/health", func(c *fiber.Ctx) error {
		return c.SendString("User Service is up and running!")
	})

	app.Post("/api/register", func(c *fiber.Ctx) error {
		user := new(User)

		if err := c.BodyParser(user); err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": "Invalid request payload",
			})
		}

		result := DB.Create(&user)
		if result.Error != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Registration failed: email already exists or server error",
			})
		}

		return c.Status(201).JSON(fiber.Map{
			"message": "User successfully registered",
			"userId":  user.ID,
		})
	})

	app.Listen(":8080")
}
