require 'net/http'
require 'json'
require 'uri'

class ApiClient
  BASE_URL = "http://localhost:8080/api"

  def initialize(token)
    @token = token
  end

  def create_folder(name)
    post("/folders", { name: name })
  end

  def create_flashcard(front, back, folder_id = nil)
    payload = { front: front, back: back }
    payload[:folderId] = folder_id if folder_id
    post("/flashcards", payload)
  end

  def fetch_folders
    get("/folders")
  end

  private

  def post(path, body)
    uri = URI("#{BASE_URL}#{path}")
    request = Net::HTTP::Post.new(uri)
    request["Authorization"] = "Bearer #{@token}"
    request["Content-Type"] = "application/json"
    request.body = body.to_json

    response = Net::HTTP.start(uri.hostname, uri.port) do |http|
      http.request(request)
    end

    handle_response(response)
  end

  def get(path)
    uri = URI("#{BASE_URL}#{path}")
    request = Net::HTTP::Get.new(uri)
    request["Authorization"] = "Bearer #{@token}"

    response = Net::HTTP.start(uri.hostname, uri.port) do |http|
      http.request(request)
    end

    handle_response(response)
  end

  def handle_response(response)
    if response.code.to_i >= 200 && response.code.to_i < 300
      JSON.parse(response.body)
    else
      puts "Error: #{response.code} - #{response.body}"
      nil
    end
  end
end
