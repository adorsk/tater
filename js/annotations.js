
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

	range.color = annotation.color;

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

    // Get markup div to contain the range.
    var markup_div = get_markup_div_for_range(range);

    // Create wrapper div for the range.
    var wrapper_div = $('<div></div>');

    // Append the wrapper_div to its corresponding markup div.
    $(markup_div).append(wrapper_div);

    // Add clearfix and annotation wrapper classes.
    // @TODO: add label classes too.
    $(wrapper_div).addClass("annotation-wrapper");

    // Create inner div.
    var inner_div = $('<div></div>');

    // Add the annotation-inner class the inner div.
    // @TODO: add label classes too.
    $(inner_div).addClass("annotation-inner");

    // Calculate width in chars of the range.
    range_width = range.end - range.start;

    // Set left position and width of wrapper div.
    // We use ems to align with our gridded text.
    $(wrapper_div).css('left', range.start.toString() + "em");
    $(wrapper_div).css('width', range_width.toString() + "em");
    
    // Set the range's underline color and thickness.
    // @ TODO: set width based on score.
    $(wrapper_div).css('height', range.thickness + "ex");
    $(wrapper_div).css('height', range.thickness + "ex");
    $(wrapper_div).css('border-bottom', range.thickness + "ex solid " + range.color );

    // Create inner div for the range.
    // @TODO: populate inner div w/ anotation content.
    inner_div = $('<div></div>');
    
    // Append the inner div to the wrapper div.
    $(wrapper_div).append(inner_div);

    // Set top position of wrapper div.
    // Get top position by looking for top-most y that does not conflict with other markup items.
    console.log("wrapper div: %o", wrapper_div);
    wrapper_top = get_next_markup_item_top(markup_div, wrapper_div);
    $(wrapper_div).css('top', wrapper_top + "px");

    // Update the markup div's height if wrapper's bottom will overflow markup div's bottom.
    markup_div_height = $(markup_div).height();
    wrapper_height = $(wrapper_div).height();
    wrapper_bottom = wrapper_top + wrapper_height;
    if (wrapper_bottom > markup_div_height){
	$(markup_div).css('height', wrapper_bottom + 'px');
    }

    //$('.line1').append('<div class="clearfix" style="margin-bottom:2px; float:left;width: 100%; height:4px; position:relative;"><div style="position: absolute; left: 12em; width: 7em; height:4px; border-top:thick dotted green;"></div></div>');

}

/**
 * get_next_markup_item_top
 * A function to get the highest valid y position for a range element.
 * Also updates the height of the line which contains the range, if needed.
 * @TODO: needs a better name.  
 * @TODO: Should probably be a method for
 * something like a markup container class.
 */
function get_next_markup_item_top(markup_div, range_div){

    // Get left and right coordinates of the range div.
    range_pos = $(range_div).position();
    range_width = $(range_div).width();
    range_left = range_pos.left;
    range_right = range_pos.left + range_width;
    console.log("range_pos: %o", range_pos);

    // Filter the elements into those elements which are in the
    // range's horizontal column.
    
    // Get the children in the markup div.   
    markup_elements = $(markup_div).children();

    // Get children which are w/in the range's
    // horizontal space.
    conflicting_children = markup_elements.filter(function(index){

	// Get left and right positions of the current child.
	pos = $(this).position();
	width = $(this).width();

	child_left = pos.left;
	child_right = pos.left + width;
	
	console.log("child: %o", this);
	console.log("cl: %s, cr: %s, rl: %s, rr: %s", child_left, child_right, range_left, range_right);

	if ( ( (child_left >= range_left) && (child_left <= range_right) ) // check left
	     || ( (child_right >= range_left) && (child_right <= range_right) ) // check right
	   ){
	    console.log("conflict");
	    return 1;
	}
	else{
	    return 0;
	}
    });

    // If there were conflicting children...
    if(conflicting_children.length > 0){

	// Get the bottom-most bottom of the conflicting children.
	var bottom = 0;
	conflicting_children.each(function(index, child){
	    child_pos = $(child).position();
	    child_height = $(child).height();
	    child_bottom = child_pos.top + child_height;

	    // update bottom if current child's bottom is greater.
	    if (child_bottom > bottom){
		bottom = child_bottom;
	    }
	});

	// Return the bottom.
	return bottom;
    }
    
    // Otherwise return 0 to put at the top of the markup div. 
    else{
	return 0;
    }
    
}

/**
 * get_line_for_range
 * get the line which contains a range.
 */
function get_markup_div_for_range(range){
    return $('.line' + range.line.toString() + ' > .markup');
}