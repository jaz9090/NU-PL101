var endTime = function (time, expr) {
    if(expr.tag == 'note' || expr.tag == 'rest')
        return time + expr.dur;
    else if(expr.tag == 'seq')
        return time + endTime(time, expr.left) + endTime(time, expr.right);
    else if(expr.tag == 'repeat')
        return time + (expr.section.dur * expr.count);
	else
        return time + Math.max(endTime(time, expr.left), endTime(time, expr.right));
};

var note = function (musexpr, time) {
    var notes = [];
    if(musexpr.tag == 'note') 
	{
		musexpr.start = time;
        console.log(musexpr.pitch + '--');
		musexpr.pitch = noteToMidi(musexpr.pitch);
        notes.push(musexpr);
    }
    else if(musexpr.tag == 'seq' || musexpr.tag == 'par')
    {
		notes = notes.concat(note(musexpr.left, time));
        if(musexpr.tag == 'seq')
            notes = notes.concat(note(musexpr.right, endTime(time, musexpr.left)));
        else
            notes = notes.concat(note(musexpr.right, time));
    }
	else if(musexpr.tag == 'repeat')
	{
		notes = notes.concat(note(musexpr.section, time));
		for(var i=1;i<musexpr.count;i++)
			notes = notes.concat(musexpr.section);
	}
    return notes;
};

var noteToMidi = function (note) {
	var midiArray = [['a',21],['b',23],['c',12],['d',14],['e',16],['f',17],['g',19]];
	console.log(note);
	var noteArray = note.split("");
	var midiNote;
	midiArray.forEach(function (midiComp)
	{
		if(noteArray[0] == midiComp[0])
		{
			midiNote = midiComp[1] + (12 * noteArray[1]);
			if(noteArray[2] == 'b')
				midiNote = midiNote - 1;
			else if(noteArray[2] == '#')
				midiNote = midiNote + 1;
		}
	});
	return midiNote;
	//return note;
}

var compile = function (musexpr) {
    return note(musexpr, 0);
};

var melody_mus = 
    { tag: 'seq',
      left: 
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'rest', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'repeat', section: { tag: 'note', pitch: 'b4', dur: 500 }, count: 3 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

console.log(melody_mus);
console.log(compile(melody_mus));