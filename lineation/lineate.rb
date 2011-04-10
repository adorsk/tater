#!/usr/bin/ruby

require 'rubygems'
require 'htmlentities'

$coder = HTMLEntities.new

def main()

  line_length = 60

  lineated_text = ""
  line_counter = 0

  text = File.read(ARGV[0])
  #text.gsub!(/\s|\r|\n/, "%s" % ["00B7".hex].pack('U*'))
  text.gsub!(/\s|\r|\n/, "%s" % '~')

  line = ""
  char_counter = 0

  text.each_char do |c|

    # If starting on first char, add to line and continue.
    # This avoids 0 % line_length.
    if (char_counter == 0)
      line += c    
      char_counter += 1
      next
    end

    if (char_counter % line_length) == 0
      puts make_line(line, line_counter)
      line_counter += 1
      line = ""
    end

    line += c

    char_counter += 1
  end

  # If there were any remaining characters, print them out.
  if (! line.empty?)
    puts make_line(line, line_counter)
  end

end

# Make a line.
def make_line(line_text, line_counter)
    line = "<div class=\"line line#{line_counter}\"><div class=\"text\">%s</div><div class=\"markup\"></div></div>" % $coder.encode(line_text)
end


if __FILE__ == $0
  main()
end
