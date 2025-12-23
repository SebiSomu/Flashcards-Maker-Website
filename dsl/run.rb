require_relative 'api_client'
require_relative 'flashcraft'

if ARGV.length < 2
  puts "Usage: ruby run.rb <dsl_file.rb> <jwt_token>"
  exit 1
end

file_path = ARGV[0]
token = ARGV[1]

unless File.exist?(file_path)
  puts "Error: File #{file_path} not found."
  exit 1
end

api_client = ApiClient.new(token)
dsl = FlashCraft.new(api_client)

puts "--- Starting FlashCraft Sync ---"
dsl.run(file_path)
puts "--- Sync Complete ---"
