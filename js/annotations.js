
/**
 * Function to render an annotation.
 * An annotation looks like:
 * {
 *  start => start_char document index,
 *  end => end_char document index,
 *  label => label,
 *  score => score,
 * }
 */

// @TODO: Make this into a parameter.
var line_len = 60;

function render_annotation(annotation){
    
    // Get char coords for start and end.
    start_coords = get_char_coordinates(annotation.start);
    end_coords = get_char_coordinates(annotation.end);

    // Get number of lines spanned.
    lines_spanned = end_coords.line - start_coords.line;

    // Generate lines ranges for the annotation.
    ranges = [];

    // If no lines were spanned...
    if (lines_spanned == 0){

	// Make a single range from the start offset to the end offset.
	ranges.push({
	    "line": start_coords.line,
	    "start": start_coords.offset,
	    "end": end_coords.offset
	});
    }

    // Otherwise if 1 or more lines were spanned...
    else{

	// Make a range from the starting offset to the end of the first line.
	ranges.push({
	    "line": start_coords.line,
	    "start": start_coords.offset,
	    "end": line_len
	});

	// For each line until the end line...
	for (var i = start_coords.line + 1; i < end_coords.line; i++){
	    
	    // Make a range for the full line.
	    ranges.push({
		"line": i,
		"start": 0,
		"end": line_len
	    });
	}

	// Make a range for the last line.
	ranges.push({
	    "line": end_coords.line,
	    "start": 0,
	    "end": end_coords.offset
	});
    }

    // For each range...
    for (var r in ranges){

	range = ranges[r];

	// Set colors and thicknesses for the ranges.
	// @TODO: make this based on score or label?
     
	range.thickness = .5;
	range.color = 'blue';

	render_range(range);
    }
    
}

/** Get character coordinates (line_number, line_offset) for 
 * a given document character index.
 */
function get_char_coordinates(char_index){

    // Initialize coords object.
    coords = {};
    
    // Get line number.
    coords.line = Math.floor(char_index/line_len);

    // Get line offset.
    coords.offset = char_index % line_len;

    return coords;
}

/**
 * Render a given range. {line, start, end, color}
 */
function render_range(range){
    
    // Create container div for the range.
    var container_div = $('<div></div>');

    // Add clearfix and annotation container classes.
    // @TODO: add label classes too.
    $(container_div).addClass("clearfix annotation-container");

    // Create inner div for the range.
    inner_div = $('<div></div>');
    
    // Append the inner div to the range div.
    $(container_div).append(inner_div);

    // Add the annotation-inner class the inner div.
    $(inner_div).addClass("annotation-inner");

    // Calculate width in chars of the range.
    range_width = range.end - range.start;

    // Set left position and width of inner_div.
    // We use ems to align with our gridded text.
    $(inner_div).css('left', range.start.toString() + "em");
    $(inner_div).css('width', range_width.toString() + "em");
    
    // Set the range's underline color and thickness.
    // @ TODO: set width based on score.
    $(container_div).css('height', range.thickness + "ex");
    $(inner_div).css('height', range.thickness + "ex");
    $(inner_div).css('border-bottom', range.thickness + "ex solid " + range.color );

    // Append the range_div to its corresponding line.
    $('.line' + range.line.toString()).append(container_div);


    //$('.line1').append('<div class="clearfix" style="margin-bottom:2px; float:left;width: 100%; height:4px; position:relative;"><div style="position: absolute; left: 12em; width: 7em; height:4px; border-top:thick dotted green;"></div></div>');

}