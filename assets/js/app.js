/**
 * Parse a template with data
 * 
 * @param {String} tpl
 * @param {Object} data
 * @returns {String}
 */
var parseStr = function (tpl, data) {
    return tpl.replace(/\{\{([\w\.]*)\}\}/g, function (str, key) {
        var keys = key.split('.');
        var v = data[keys.shift()];
        var l = keys.length;
        for (var i = 0; i < l; i++) {
            v = v[keys[i]];
        }
        return typeof v !== 'undefined' && v !== null ? v : '';
    });
};

/**
 * Array to csv string
 * 
 * @param {Array} ary
 * @returns {String}
 */
var ary2csv = function (ary) {
    var l = ary.length;
    for (var i = 0; i < l; i++) {
        ary[i] = ary[i].replace(/"/g, '""');
    }
    return '"' + ary.join('","') + '"' + "\n"
};

/**
 * Add new variable
 */
$('#addVar').on('click', function () {
    var nRows = $('#vars > .row').length;
    var $new = $('#templates .row').clone();
    $new.find('label').attr('for', 'VAR' + nRows).text('{{' + 'VAR' + nRows + '}}');
    $new.find('input').attr('id', 'VAR' + nRows);
    $new.appendTo('#vars');
});

$(document).on('keyup', '.var', function () {
    var len = $(this).val().length;
    var $row = $(this).closest('.row');
    $row.find('.col-xs-4').text('' + len);
    if (len > 35) {
        $row.css('color', 'red');
    }
    else {
        $row.css('color', '');
    }
});
$(document).on('focusout', '.zone', function () {
var text = $('.zone').val();
var lines = text.split('\n');
var count = lines.length;   
var $row = $(this).closest('.row');

$row.find('.zone-count').text('' + count);

//console.log(count);
});
/**
 * Add new group
 */
$('#addGroup').on('click', function () {
    var $new = $('#groups .group:first').clone();
    $new.find('input').val('');
    $new.appendTo('#groups');
});

/**
 * Build the report
 */
$('#make').on('click', function () {

// Variables dynamiques
    var zones = {};
    var nRows = null;
    var isValid = true;
    $('#zones textarea').each(function () {
        var ary = $(this).val().split("\n");
        zones[$(this).attr('id')] = ary;
        if (nRows === null) {
            nRows = ary.length;
        }
        else if (ary.length !== nRows) {
            isValid = false;
            return;
        }
    });
    if (!isValid) {
        alert('Chaque zone de texte doit contenir le même nombre de lignes (vides ou non vides).');


        return;
    }

// Variables fixes
    var data = {};
    $('#vars input').each(function () {
        data[$(this).attr('id')] = $.trim($(this).val());
    });
    // Clear report
    $('#report').empty();
    // Columns name
    var titles = [];
    $('#groups .group:first label').each(function () {
        titles.push($(this).text());
    });
    $('#report').append(ary2csv(titles));
    // On boucle sur le nombre de ligne dans les zones
    for (var i = 0; i < nRows; i++) {

// On ajoute a data chaque zone pour la ligne i
        for (var j in zones) {
            data[j] = zones[j][i];
        }

// On parse chaque texte
        $('#groups .group').each(function () {
            var cols = [];
            $(this).find('input').each(function () {
                cols.push(parseStr($(this).val(), data));
            });
            $('#report').append(ary2csv(cols));
        });
    }
});



