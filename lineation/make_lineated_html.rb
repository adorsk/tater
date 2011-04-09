#!/usr/bin/ruby

require 'erb'

# Read in lineated text.
lineated_text = File.read(ARGV[0])

template = ERB.new File.new(ARGV[1]).read, nil, "%"
puts template.result(binding)



