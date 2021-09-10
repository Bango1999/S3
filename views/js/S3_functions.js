$(document).ready(function() {
  //prolly dont need globals, but were good for 1.0
  var json = {}; //global var to store the json we get from ajax
  var statColumns = {}; //will hold what columns need to go in which tables
  var statTypes = [ //used later on as keys to build statColumns
    'All Rotorcraft Hours', //also used to build dropdown selector for each server
    'US Aircraft Hours', //also used in tabulate and getFirstLevelIndices
    'RU Aircraft Hours',
    'Other Aircraft Hours',
    'Player Kills',
    'Player Deaths'
  ];

  //ajax request to get data to populate tables with
  //fire immediately on doc ready
  $.ajax({
    url: "/api/web/fetch",
    type: "POST",
    dataType: "json",
    data: {},
    //on successful data reception, we can now show the data and make it all functional
    success: function(data) {
      if (data === false) {
        console.log('ERROR: Server could not return a valid database object.');
        return;
      }
      json = data; //make the data global just in case we need it later
      refreshColumnMappings(data); //make all the columns for each type of table
      updateServersTable(data); //populate server list / actions

      //register lodaing icon events and when to start/stop
      $('#loading-icon').bind('showTree', function() {
        $(this).css({'padding-top':'45px','padding-bottom':'35px'});
        $(this).show();
      });
      $('#loading-icon').bind('treeCreated', function() {
        $(this).hide();
        $(this).css({'padding-top':'0px','padding-bottom':'0px'});
      });
      $('.tree-view').on('click', 'button', function() {
        $('#loading-icon').trigger('showTree');
        $('.tree-view button').hide();
        setTimeout(function() { showTree() }, 5);
      });
      //user clicks a show table action, display the table they requested
      $('.table-actions').on('change', 'select', function(e) {
        var dId = $(this).find("option:selected").attr('data-id');
        var val = $(this).find("option:selected").attr('value');
        if (dId !== 'false') {
          $('.table-actions select').each(function() {
            if ($(this).find('option').eq(1).attr('data-id') != dId) {
              $(this).val($(this).find('option:first').val());
            }
          })
          tableToHTML(tabulate(dId, val));
        } else if ( $.fn.DataTable.isDataTable('#datatable') ) {
          $('#datatable').DataTable().destroy();
          $('#datatable').empty();
        }
      });

    }, //end success
    error: function(err) { console.log(err) }
  }); //end ajax call

  //------------------------

  //get the nested ids to look in depending on what the user wants to see
  function getFirstLevelIndices(stat, cols) {
    switch (stat) {
      case statTypes[0]:
        return ['times'];
        break;
      case statTypes[1]:
        return ['times'];
        break;
      case statTypes[2]:
        return ['times'];
        break;
      case statTypes[3]:
        return ['times'];
        break;
      case statTypes[4]:
        return ['times'];
        break;
      case statTypes[5]:
        return ['times'];
        break;
      default:
        return false;
    }
  }

  //------------------------

  function showTree() {
    $('#json-tree').removeAttr('style');
    $('#json-tree').jsonViewer(json, {collapsed: true}); //call tree view on the json
    $('#loading-icon').trigger('treeCreated');
  }

  //------------------------

  //make the header that lets you choose which table to render
  //choose server, choose stat to view
  function updateServersTable(data) {
    var servers = $('#servers');
    servers.append(
      $('<div></div>').addClass('row').addClass('server-list-row-header')
        .append(
          $('<div></div>').text('Server List').addClass('col-md-8 col-sm-8 col-xs-8')
        ).append(
          $('<div></div>').text('Actions').addClass('col-md-4 col-sm-4 col-xs-4')
        )
    );
    for (var i in data) { //for each server
      servers.append(
        $('<div></div>').addClass('row').addClass('server-list-row').append(
          $('<div></div>').text(data[i]['name']).addClass('col-md-8 col-sm-8 col-xs-8') //add the row for server
        ).append( //add actions
          $('<div></div>').addClass('table-actions').addClass('col-md-4 col-sm-4 col-xs-4').append(
            $('<select></select>').addClass('form-control input-md')
              .append($('<option></option>').attr({'value':'false','data-id':'false'}).text('-'))
              .append($('<option></option>').attr({'value':statTypes[0],'data-id':i}).text(statTypes[0]))
              .append($('<option></option>').attr({'value':statTypes[1],'data-id':i}).text(statTypes[1]))
              .append($('<option></option>').attr({'value':statTypes[2],'data-id':i}).text(statTypes[2]))
              .append($('<option></option>').attr({'value':statTypes[3],'data-id':i}).text(statTypes[3]))
              .append($('<option></option>').attr({'value':statTypes[4],'data-id':i}).text(statTypes[4]))
              .append($('<option></option>').attr({'value':statTypes[5],'data-id':i}).text(statTypes[5]))
          )
        )
      );
    }
    //console.log('updated servers table');
  }

  //------------------------

  //returns specific formatted values according to what data its trying to table
  function floatingPtHours(val) {
    return (Math.round((100*val/3600))/100); //floating pt hours
  }

  function checkNested(obj, level,  ...rest) {
    if (obj === undefined) return false
    if (rest.length == 0 && obj.hasOwnProperty(level)) return true
    return checkNested(obj[level], ...rest)
  }


  //------------------------

  function makeDataRows(table, serverId, stat, columns) {
    //loop through player nodes
      //loop through player's stats likes times
        //determine if node should be used for something
          //if so then use it
          //differnt
          //ways
    var firstLevelIndices = getFirstLevelIndices(stat);
    if (firstLevelIndices == false) { console.log("ERROR getting first level indices");return false;}
    for (var pid in json[serverId]['stats']) { //loop through player nodes
      for (var fli in json[serverId]['stats'][pid]) { //loop through stats for player
        if (firstLevelIndices.indexOf(fli) != -1) { //we want something from here
          //here comes the messy part...

          //Kills table, 'kills' node content derivation
          if (fli == 'times' && stat == statTypes[4]) {

            let Infantry = 0;
            let GroundUnits = 0;
            let Planes = 0;
            let Helicopters = 0;
            let Ships = 0;
            let Buildings = 0;
            let PvPKills = 0;
            let FriendlyKills = 0;
            for (var index in json[serverId]['stats'][pid][fli]) {

              if (checkNested(json[serverId]['stats'][pid][fli][index],
              'kills',
              'Ground Units',
              'Infantry'
              ))
                Infantry += json[serverId]['stats'][pid][fli][index]['kills']['Ground Units']['Infantry'];
              if (checkNested(json[serverId]['stats'][pid][fli][index],
              'kills',
              'Ground Units',
              'total'
              ))
                GroundUnits += json[serverId]['stats'][pid][fli][index]['kills']['Ground Units']['total'];
              if (checkNested(json[serverId]['stats'][pid][fli][index],
              'kills',
              'Planes',
              'total'
              ))
                Planes += json[serverId]['stats'][pid][fli][index]['kills']['Planes']['total'];
              if (checkNested(json[serverId]['stats'][pid][fli][index],
              'kills',
              'Helicopters',
              'total'
              ))
                Helicopters += json[serverId]['stats'][pid][fli][index]['kills']['Helicopters']['total'];
              if (checkNested(json[serverId]['stats'][pid][fli][index],
              'kills',
              'Ships',
              'total'
              ))
                Ships += json[serverId]['stats'][pid][fli][index]['kills']['Ships']['total'];
              if (checkNested(json[serverId]['stats'][pid][fli][index],
              'kills',
              'Buildings',
              'total'
              ))
                Buildings += json[serverId]['stats'][pid][fli][index]['kills']['Buildings']['total'];
            }

            table[pid][columns[stat].indexOf('Infantry')] = Infantry;
            table[pid][columns[stat].indexOf('Ground Units')] = GroundUnits;
            table[pid][columns[stat].indexOf('Planes')] = Planes;
            table[pid][columns[stat].indexOf('Helicopters')] = Helicopters;
            table[pid][columns[stat].indexOf('Ships')] = Ships;
            table[pid][columns[stat].indexOf('Buildings')] = Buildings;
            table[pid][columns[stat].indexOf('PvP Kills')] = 'N/A';
            table[pid][columns[stat].indexOf('Friendly Kills')] = 'N/A';
          //Hours Table, 'times' node content derivation
          } else if (fli == 'times' && (stat == statTypes[0] || stat == statTypes[1] || stat == statTypes[2] || stat == statTypes[3])) {
            var totalHrs = 0;
            for (var index in json[serverId]['stats'][pid][fli]) {
              var nameKey = columns[stat].indexOf(index);
              if (nameKey != -1) {
                totalHrs += json[serverId]['stats'][pid][fli][index]['total'];
                table[pid][nameKey] = floatingPtHours(json[serverId]['stats'][pid][fli][index]['total']);
              }
            }
            //populate total airframe hours (in this category)
            table[pid][columns[stat].indexOf('Total')] = floatingPtHours(totalHrs);
          } else if (fli == 'times' && stat == statTypes[5]) { //pilotDeath > Deaths, crash > Crashes, eject > Ejections
            let Deaths = 0;
            let Crashes = 0;
            let Ejections = 0;
            console.log('twf');
            for (var index in json[serverId]['stats'][pid][fli]) {
              console.log(index);
              if (checkNested(json[serverId]['stats'][pid][fli][index],
              'actions',
              'losses',
              'pilotDeath'
              ))
                Deaths += json[serverId]['stats'][pid][fli][index]['actions']['losses']['pilotDeath'];
              if (checkNested(json[serverId]['stats'][pid][fli][index],
              'actions',
              'losses',
              'crashLanding'
              ))
                Deaths += json[serverId]['stats'][pid][fli][index]['actions']['losses']['pilotDeath'];
              if (checkNested(json[serverId]['stats'][pid][fli][index],
              'actions',
              'losses',
              'crash'
              ))
                Crashes += json[serverId]['stats'][pid][fli][index]['actions']['losses']['crash'];
              if (checkNested(json[serverId]['stats'][pid][fli][index],
              'actions',
              'losses',
              'crashLanding'
              ))
                Crashes += json[serverId]['stats'][pid][fli][index]['actions']['losses']['crashLanding']
              if (checkNested(json[serverId]['stats'][pid][fli][index],
              'actions',
              'losses',
              'eject'
              ))
                Ejections += json[serverId]['stats'][pid][fli][index]['actions']['losses']['eject'];
            }

            table[pid][columns[stat].indexOf('Deaths')] = Deaths;
            table[pid][columns[stat].indexOf('Crashes')] = Crashes;
            table[pid][columns[stat].indexOf('Ejections')] = Ejections;
            table[pid][columns[stat].indexOf('PvP Deaths')] = 'N/A';
        }
      } //times
    }// end of player stats

    } //end of players list
    //console.log(table);
    return table;
  }

  //------------------------

  function tabulate(serverId, stat) {
    var table = [];
    table[0] = statColumns[stat];
    for (var player in json[serverId]['stats']) {
      table.push([]);
      for (var column in statColumns[stat]) { //go ahead and set name column now
        if (column == 0) { table[parseInt(player)][column] = json[serverId]['stats'][player]['name'] }
        else { table[parseInt(player)][column] = 0 } //if not name, set 0
      }
    }
    return makeDataRows(table, serverId, stat, statColumns);
  }

  //------------------------

  function createTableHeader(arr) {
    var thead = $('<thead></thead>');
    var tr = $('<tr></tr>');
    for (var i in arr) { tr.append($('<th></th>').text(arr[i])) }
    $('.datatable').append(thead.append(tr));
  }

  //------------------------

  function createTableBody(arr) {
    var tbody = $('<tbody></tbody>');
    for (var pid in arr) {
      if (pid !== '0') { //dont add thead data
        var htmlRow = $('<tr></tr>');
        for (var col in arr[pid]) { htmlRow.append($('<td></td>').text(arr[pid][col])) }
        tbody.append(htmlRow);
      }
    }
    $('.datatable').append(tbody);
  }

  //-------------------------

  function tableToHTML(arr) {
    if ( $.fn.DataTable.isDataTable('#datatable') ) {
      $('#datatable').DataTable().destroy();
      $('#datatable').empty();
    }
    $('#dt-container').html('');
    $('#dt-container').append($('<table></table').attr({'class':'table datatable','id':'datatable'}));
    createTableHeader(arr[0]);
    createTableBody(arr);
    $('#datatable').DataTable();
  }

  //-------------------------

  function refreshColumnMappings(json) {
    //these are some of the table-specific columns we will need to look for in the json
    var arch = [ //all rotorcraft hours
      'UH-1H',
      'ah-64d',
      'CobraH',
      'Ka-50',
      'Mi-24P',
      'Mi-8MT',
      'SA342L',
      'SA342M'
    ];
    var usach = [ //us aircraft hours
      'A-10C',
      'A-10C_2',
      'AV8BNA',
      'F-14B',
      'F-15C',
      'F-16C_50',
      'F-5E-3',
      'F-86F Sabre',
      'FA-18C_hornet',
      'P-51D'
    ];
    var ruach = [ //ru aircraft hours
      'IL-76MD',
      'MiG-15bis',
      'MiG-21Bis',
      'MiG-29A',
      'MiG-29S',
      'Su-25',
      'Su-25T',
      'Su-27',
      'Su-33'
    ];
    var oach = [ //other aircraft hours
      'AJS37',
      'Bf-109K-4',
      'FW-190D9',
      'L-39C',
      'L-39ZA',
      'M-2000C',
      'SpitfireLFMkIX',
      'Yak-52'
    ];
    var killObjects = [
      'Ground Units',     // the web client will generate 2 columns,
      'Planes',           // Infantry and Ground Units (non-infantry)
      'Helicopters',
      'Ships',
      'Buildings'
    ];


    //make  heli hours columns
    var allRotorcraftHoursCols = [];
    Array.prototype.push.apply(allRotorcraftHoursCols, arch);
    allRotorcraftHoursCols.unshift('Total');
    allRotorcraftHoursCols.unshift('Pilot');

    //make  us ac hours columns
    var usAircraftHoursCols = [];
    Array.prototype.push.apply(usAircraftHoursCols, usach);
    usAircraftHoursCols.unshift('Total');
    usAircraftHoursCols.unshift('Pilot');

    //make  ru ac hours columns
    var ruAircraftHoursCols = [];
    Array.prototype.push.apply(ruAircraftHoursCols, ruach);
    ruAircraftHoursCols.unshift('Total');
    ruAircraftHoursCols.unshift('Pilot');

    //make  other ac hours columns
    var oAircraftHoursCols = [];
    Array.prototype.push.apply(oAircraftHoursCols, oach);
    oAircraftHoursCols.unshift('Total');
    oAircraftHoursCols.unshift('Pilot');

    //make kills columns
    var killsCols = [];
    Array.prototype.push.apply(killsCols, killObjects);
    killsCols.push('PvP Kills');
    killsCols.push('Friendly Kills');
    if (killsCols.indexOf('Ground Units') > -1) {
      killsCols.unshift('Infantry'); //if theyre sending us ground units, make a spot for infantry ground units
    }
    killsCols.unshift('Pilot');

    //deaths columns are completely placid, there is no whitelist or variation needed
    //but make them (again?) anyway since we are being all official
    var deathsCols = [ "Pilot", "Deaths", "Crashes", "Ejections", "PvP Deaths" ];

    //set the global stat columns
    statColumns = {};
    statColumns[statTypes[0]] = allRotorcraftHoursCols;
    statColumns[statTypes[1]] = usAircraftHoursCols;
    statColumns[statTypes[2]] = ruAircraftHoursCols;
    statColumns[statTypes[3]] = oAircraftHoursCols;
    statColumns[statTypes[4]] = killsCols;
    statColumns[statTypes[5]] = deathsCols;

  }
});
