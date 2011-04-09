#!/usr/bin/ruby

require 'erb'

line_length = 100

lineated_text = ""
line_counter = 0

text = File.read("book.txt")
text.gsub!(/\s+|\n|\r/, ' ')

line = ""
char_counter = 1
text.each_char do |c|
  if (char_counter % line_length) == 0
    puts "<div class=\"line line#{line_counter}\"><div class=\"text\">#{line}</div></div>"
    line_counter += 1
    line = ""
  end

  line += c

  char_counter += 1
end

