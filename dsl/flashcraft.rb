class FlashCraft
  def initialize(api_client)
    @api_client = api_client
    @current_folder_id = nil
    @existing_folders = {}
  end

  def run(file_path)
    # Cache existing folders to avoid duplicates or to find IDs by name
    folders = @api_client.fetch_folders
    if folders
      folders.each { |f| @existing_folders[f["name"]] = f["ID"] }
    end

    instance_eval(File.read(file_path), file_path)
  end

  def folder(name, &block)
    puts "Processing folder: #{name}..."
    
    # Check if folder exists, otherwise create it
    folder_id = @existing_folders[name]
    if folder_id
      puts "  Folder exists (ID: #{folder_id})"
    else
      puts "  Creating new folder..."
      res = @api_client.create_folder(name)
      if res
        folder_id = res["ID"]
        @existing_folders[name] = folder_id
        puts "  Folder created (ID: #{folder_id})"
      end
    end

    if folder_id
      old_folder_id = @current_folder_id
      @current_folder_id = folder_id
      instance_eval(&block) if block_given?
      @current_folder_id = old_folder_id
    else
      puts "  Failed to resolve folder ID for #{name}. Skipping cards."
    end
  end

  def flashcard(front, back)
    puts "  Creating card: #{front} -> #{back}"
    @api_client.create_flashcard(front, back, @current_folder_id)
  end
end
