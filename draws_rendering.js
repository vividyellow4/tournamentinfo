function getVenues(objDraw) {
  var venueArray = [];
  if (!$.isEmptyObject(objDraw['drawsData'])) {
      if (!$.isEmptyObject(objDraw['drawsData'][0]['eventVenues'])) {
          $.each(objDraw['drawsData'][0]['eventVenues'], function (key, value) {
              venueArray[value['venueId']] = value['venueName'];
          });
      }
  }
  return venueArray;
}
function generateBracketHTML(objDraw, structIndex) {  
if ( !$.isEmptyObject(objDraw['drawsData']) ){
    if (!structIndex || structIndex == '') {
        structIndex = 0;
    }
    var i = 0;
    var score = '';
    var html = '<div class="row tournament-brackets">';
    var objDrawNew = objDraw['drawsData'][0]['structures'][structIndex]['roundMatchUps'];
    var matchUpFormat = objDraw['drawsData'][0]['matchUpFormat'];
    var venueArray = getVenues(objDraw);
    console.log(venueArray);
    var curscore = '';
    var curwinningPlayer = '';
    var curobj2 = '';
    var curobj3 = '';
    var curindex = 0;
    var cq_total = 0;
    var rr_total = 0;
    var curwinningSide = '';
    var g = 0;
    $.each(objDrawNew, function (key, value) {
        var m = 1;
        var numMatches = value.length;
        i++;//round
        curindex = i;
        html += ' <ul class="container col-sm-12 col-md bracket bracket-' + i + ' ';
        var pattern = /-Q$/;
        if (pattern.test(value[0]['roundName']) == true) {
            html += ' bracket-cq ';
            cq_total++;
        }
        var pattern2 = /^R\d$/;
        if (pattern2.test(value[0]['roundName']) == true) {
            html += ' bracket-rr ';
            rr_total++;
        }
        if (cq_total > 0) {
            html += ' cq-' + cq_total + ' ';
        }
        html += '" data-round="' + value[0]['roundName'] + '" data-key="' + key + '">';
        var list_count = 0;
        var participant_count = 0;
        $.each(value, function (key2, value2) {
            curobj2 = value2;
            if (value2['matchUpStatus'] == 'BYE' && pattern2.test(value[0]['roundName']) == true) {
                //console.log('Skip for RR BYE');
            } else {
                var p = 0;//side
                if (value2['timeItems']) {
                    if (value2['timeItems'].length == 2) {
                        var venue = value2['timeItems'][2]['itemValue'];
                    } else if( value2['timeItems'].length == 3){
                        var venue = value2['timeItems'][2]['itemValue'];

                    }else{ var venue = '';}
                }
                var winningSide = value2['winningSide'];
                if ($.isEmptyObject(value2['schedule']) !== true && ( value2['matchUpStatus'] != 'BYE' && value2['matchUpStatus'] != 'RETIRED' && value2['matchUpStatus'] != 'WALKOVER' )&&value2['schedule']['scheduledDate']!='') {
                    var today = moment().format('YYYY-MM-DD');
                    var sched = moment(value2['schedule']['scheduledDate']).format('ddd MMM DD') + ' ' + moment(today + ' ' + value2['schedule']['scheduledTime']).format('hh:mm A');
                    sched+=' '+value2['schedule']['venueId'];
                } else if ($.isEmptyObject(value2['schedule']) !== true && value2['matchUpStatus'] == 'RETIRED') {
                    var today = moment().format('YYYY-MM-DD');
                    var sched = moment(value2['schedule']['scheduledDate']).format('ddd MMM DD') + ' ' + moment(today + ' ' + value2['schedule']['scheduledTime']).format('hh:mm A');
                    sched+=' '+value2['schedule']['venueId'];
                } else {
                    var sched = '  ';
                }
                var pattern = /-Q$/;
                if (cq_total > 0 && list_count == 0) {
                    if (i == 1) {
                        html += '<li class="match cq-spacer cq-spacer-' + i + '"></li>';
                    } else {
                        if (cq_total == 1) {

                        } else if (cq_total % 2 == 0) {
                            if (pattern.test(value2['roundName']) == true) {

                            } else {
                                html += '<li class="match cq-spacer cq-spacer-' + i + ' grow-fixed"></li>';
                            }
                        } else if (cq_total % 3 == 0){
                            if (pattern.test(value2['roundName']) == true) {
                                html += '<li class="match cq-spacer cq-spacer-' + i + ' grow-fixed"></li>';
                            } else {

                            }
                        }
                    }
                }
                if ( !$.isEmptyObject(value2['sides']) ){
                    if (value2['sides'][0]['participantId']==''||value2['sides'][1]['participantId']==''){
                        html += '<li class="match byematch">';
                    }else {
                        html += '<li class="match">';
                    }
                }else {
                    html += '<li class="match">';
                }
                $.each(value2['sides'], function (key3, value3) {
                    curobj3 = value3;
                    //console.log( 'empty? '+ $.isEmptyObject(value3['participant']) );
                    // console.log('drawPosition:'+value3['drawPosition']);
                    //if value3['drawPosition'] in sidePosArray[0] g
                    if (typeof value3['participant'] !== 'undefined') {

                        if (i == 3) {
                            html += '<!--' + i + '/cq_total=' + cq_total + '/list_count=' + list_count + '--->';
                        }
                        if (p == 0) {
                            html += '<div class="player-spacer"></div>';
                            if (value3['displaySideNumber'] == '1') {
                                if (cq_total > 0 && cq_total % 2 == 0 && i == cq_total * 2) {
                                    html += '<div class="player bottom flipped" ';
                                } else {
                                    html += '<div class="player top" ';
                                }
                            } else {
                                html += '<div class="player bottom flipped" ';
                            }
                        } else {
                            if (value3['displaySideNumber'] == '2') {
                                if (cq_total > 0 && cq_total % 2 == 0 && i == cq_total * 2) {
                                    html += '<div class="player top flipped" ';
                                } else {
                                    html += '<div class="player bottom" ';
                                }
                            } else {
                                html += '<div class="player top flipped" ';
                            }
                        }
                        if ((p == 0 && value2['winningSide'] == 1) || (p == 1 && value2['winningSide'] == 2 ) || (value2['matchUpStatus'] == 'BYE' && value3['bye'] !== true )) {
                            html += 'data-winner="true" ';
                        }
                        if (value3['sourceDrawPositionRange'] != undefined) {
                            html += ' data-drawposition="' + value3['sourceDrawPositionRange'] + '"';
                        } else {
                            if (i == 1) {
                                html += ' data-drawposition="' + value3['drawPosition'] + '"';
                            }
                        }
                        html += ' >';
                        html += '<span class="player_icon">';
                        if ((p == 0 && value2['winningSide'] == 1) || (p == 1 && value2['winningSide'] == 2 ) || (value2['matchUpStatus'] == 'BYE' && value3['bye'] !== true )) {
                            html += '<i class="fal fa-smile fa-lg bg-warning rounded-circle"></i></span>';
                        } else {
                            html += '<i class="fas fa-user-circle fa-lg"></i></span>';
                        }
                        html += '<span class="playername" ';
                        if(value3['participantId']){
                            html+=' data-stID="'+value3['participantId']+'" ';
                        }
                        if (value3['seedNumber'] != undefined) {
                            html += ' data-seednumber="' + value3['seedNumber'] + '" ';
                        }
                        if (pattern2.test(value[0]['roundName']) == true) { //roundrobin
                            if (i == 1) {
                                if (value3['participant']['individualParticipantIds'].length > 1) {
                                    html += ' data-citystate="' + value3['participant']['individualParticipants'][0]['person']['addresses'][0]['city'] + ', ' + value3['participant']['individualParticipants'][0]['person']['addresses'][0]['state'] + '/' + value3['participant']['individualParticipants'][1]['person']['addresses'][0]['city'] + ', ' + value3['participant']['individualParticipants'][1]['person']['addresses'][0]['state'] + '" ';
                                } else {
                                    if (value2['matchUpType'] != 'DOUBLES') {
                                        html += ' data-citystate="' + value3['participant']['person']['addresses'][0]['city'] + ', ' + value3['participant']['person']['addresses'][0]['state'] + '" ';
                                    }
                                }
                            }
                            if ((p == 0 && value2['winningSide'] == 1) || (p == 1 && value2['winningSide'] == 2 ) || (value2['matchUpStatus'] == 'BYE' && value3['bye'] !== true ) || (value2['matchUpStatus'] == 'DOUBLE_WALKOVER')) {
                                var score = value2['score']['scoreStringSide' + value2['winningSide']];
                                if (value2['matchUpStatus'] == 'WALKOVER'|| value2['matchUpStatus'] == 'DOUBLE_WALKOVER') {
                                    html += ' data-score="' + value2['matchUpStatus'] + '" ';
                                } else if (value2['matchUpStatus'] == 'RETIRED') {
                                    html += ' data-score="' + value2['matchUpStatus'] + ' ' + score + '" ';
                                }else {
                                    html += ' data-score="' + score + '" ';
                                }
                            }
                        } else {

                            if (i == 1) {
                                if (value3['participant']['individualParticipantIds'].length > 1) {
                                    html += ' data-citystate="' + value3['participant']['individualParticipants'][0]['person']['addresses'][0]['city'] + ', ' + value3['participant']['individualParticipants'][0]['person']['addresses'][0]['state'] + '/' + value3['participant']['individualParticipants'][1]['person']['addresses'][0]['city'] + ', ' + value3['participant']['individualParticipants'][1]['person']['addresses'][0]['state'] + '" ';
                                } else {
                                    if (value2['matchUpType'] != 'DOUBLES') {
                                        html += ' data-citystate="' + value3['participant']['person']['addresses'][0]['city'] + ', ' + value3['participant']['person']['addresses'][0]['state'] + '" ';
                                    }
                                }
                            } else {
                                $.each(objDrawNew[(i - 1)], function (key, value) {
                                    // console.log(value);
                                    if (value['winningSide']) {
                                        var winningSide = value['winningSide'];
                                        if (value['score'] && typeof value['winningSide'] !== 'undefined' && typeof value['winningSide'] !== 'null') {
                                            var score = value['score']['scoreStringSide' + winningSide];
                                            var winningPlayer = value['sides'][(winningSide - 1)]['participantId'];
                                            //console.log(score+' '+winningSide+' '+winningPlayer);
                                            if (winningPlayer == value3['participant']['participantId']) {
                                                if (value['matchUpStatus'] == 'WALKOVER') {
                                                    html += ' data-score="' + value['matchUpStatus'] + '" ';
                                                } else if (value['matchUpStatus'] == 'RETIRED') {
                                                    html += ' data-score="' + value['matchUpStatus'] + ' ' + score + '" ';
                                                } else  {
                                                    html += ' data-score="' + score + '" ';
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                        }
                        html += ' ><span class="nowrap"  style="cursor:pointer" onclick="openTennislinkTeamPage(\''+value3['participant']['participantId']+'\');return false">' + value3['participant']['participantName'];
                        
                        if (value3['seedNumber']) {
                            html += '<span class="seed">' + value3['seedNumber'] + '</span>';
                        }
                        html += '</span></span></div>';
                        html += '<!--end of .player-->';
                        if (i > 1) {
                            $.each(objDrawNew[(i - 1)], function (key, value) {
                                // console.log(value);
                                if (value['winningSide']) {
                                    var winningSide = value['winningSide'];
                                    var winningPlayer = value['sides'][(winningSide - 1)]['participantId'];
                                    //console.log(score+' '+winningSide+' '+winningPlayer);
                                    if (winningPlayer == value3['participantId']) {
                                        //       console.log('score1:' + score);
                                        score = value['score']['scoreStringSide' + winningSide];
                                    }
                                }
                            });
                            //   console.log('score:' + score);
                        }
                        curwinningSide = value2['winningSide'];
                        // console.log('curwin:'+curwinningSide);
                        if (value2['sides'][(curwinningSide - 1)]) {
                            if (value2['sides'][(curwinningSide - 1)]['participant']['participantName']) {
                                curwinningPlayer = value2['sides'][(curwinningSide - 1)]['participant']['participantName'];
                            }
                        }
                        //  console.log('curplayer:'+curwinningPlayer);
                        if (value2['score']) {
                            curscore = value2['score']['scoreStringSide' + curwinningSide];
                            //  console.log('curscore:'+curscore);
                        }
                        if (value3['sideNumber'] == '1') {
                            //html+='<div class="schedtime schedtime-'+i+'"  data-sched="'+sched+'" >'+sched.substr(5, 11)+'</div>';
                            if (venueArray[venue] != undefined) {
                                if (sched != '') {
                                    if (value2['matchUpStatus']=='approved'||value2['matchUpStatus']=='completed') {
                                        html += '<div class="matchupbtncont schedtime schedtime-' + i + ' ts1"  data-site="' + venueArray[venue] + '" data-sched="' + sched.toUpperCase() + '" data-matchupid="' + value2['matchUpId'] + '" data-matchformat="' + matchUpFormat + '">' + sched.toUpperCase() + '</div>';
                                    }else {
                                        html += '<div class="schedtime schedtime-' + i + ' ts2"  data-site="' + venueArray[venue] + '" data-sched="' + sched.toUpperCase() + '" data-matchformat="' + matchUpFormat + '" >' + sched.toUpperCase() + '</div>';
                                    }
                                } else {
                                    html += '<div class="schedtime schedtime-' + i + ' ts3"  ></div>';
                                }
                            } else {
                                if (sched != '') {
                                    if (value2['matchUpStatus']=='approved'||value2['matchUpStatus']=='completed') {
                                        html += '<div class="matchupbtncont schedtime schedtime-' + i + ' ts4"  data-sched="' + sched.toUpperCase() + '" data-matchupid="' + value2['matchUpId'] + '" data-matchformat="' + matchUpFormat + '">' + sched.toUpperCase() + '</div>';
                                    }else {
                                        html += '<div class="schedtime schedtime-' + i + ' ts5"  data-sched="' + sched.toUpperCase() + '" >' + sched.toUpperCase() + '</div>';
                                    }
                                } else {
                                    html += '<div class="schedtime schedtime-' + i + ' ts6" ></div>';
                                }
                            }
                        }
                        if (p != 0) {
                            html += '<div class="player-spacer"></div>';
                        }
                    } else {
                        lineHTML = 'TBD';
                        var playername='TBD';
                        var score = '';
                        if (p == 0) {
                            html += '<div class="player-spacer"></div>';
                            if (value3['displaySideNumber'] == '1'  ||  value3['displaySideNumber']==undefined ) {

                                html += '<div class="player top" ';
                            } else {
                                html += '<div class="player bottom flipped" ';
                            }
                        } else {
                            if (value3['displaySideNumber'] == '2' ||  value3['displaySideNumber']==undefined ) {
                                html += '<div class="player bottom" ';
                            } else {
                                html += '<div class="player top flipped" ';
                            }
                        }

                        if (value3['sourceDrawPositionRange'] != undefined) {
                            html += ' data-drawposition="' + value3['sourceDrawPositionRange'] + '"';
                        } else {
                            if (i == 1) {
                                html += ' data-drawposition="' + value3['drawPosition'] + '"';
                            }
                        }
                        html += ' >';
                        if (value3['bye'] == true) {
                            playername='BYE';
                            html += '<span class="player_icon"><i class="fas fa-forward fa-lg"></i></span>';
                            html += '<span class="playername">'+playername+'</span></div>';
                        } else {
                            if (i > 1) {
                                $.each(objDrawNew[(i - 1)], function (key, value) {
                                    if (value['matchUpStatus']=='DOUBLE_WALKOVER') {
                                        score = value['matchUpStatus'];
                                        playername = '';
                                    }
                                });
                            }
                            if (playername=='TBD'){
                                html += '<span class="player_icon"><i class="fas fa-user-circle fa-lg"></i></span>';
                                html += '<span class="playername">'+playername+'</span></div>';
                            }else {
                                html += '<span class="playername" data-score="' + score + '">'+playername+'</span></div>';
                            }

                        }
                        if (value3['sideNumber'] == '1') {
                            //insert a row with sched after tr with id $('#pos' + key + '_' + m).parent()
                            // html+='<div class="schedtime schedtime-'+i+'" data-sched="'+sched+'" >'+sched.substr(5, 11)+'</div>';
                            if (venueArray[venue] != undefined) {
                                if (sched != '') {
                                    html += '<div class="schedtime schedtime-' + i + '"  data-site="' + venueArray[venue] + '" data-sched="' + sched.toUpperCase() + '" >' + sched.toUpperCase() + '</div>';
                                } else {
                                    html += '<div class="schedtime schedtime-' + i + '"  data-site="' + venueArray[venue] + '" ></div>';
                                }
                            } else {
                                if (sched != '') {
                                    html += '<div class="schedtime schedtime-' + i + '"  data-sched="' + sched.toUpperCase() + '" >' + sched.toUpperCase() + '</div>';
                                } else {
                                    html += '<div class="schedtime schedtime-' + i + '"  ></div>';
                                }
                            }
                        } else if (value3['sideNumber'] == undefined) {
                            if (p == 0) {
                                html += '<div class="schedtime schedtime-' + i + '"  ></div>';
                            }
                        }
                        if (p != 0) {
                            html += '<div class="player-spacer"></div>';
                        }
                    }
                    m++;
                    p++;
                    participant_count++;
                })
                html += '</li>';
                //  console.log('cq_total='+cq_total + '--value.length='+value.length+'--list_count:'+list_count+'--p:'+p);
                if (cq_total > 0) {
                    if (i == 1) {
                        html += '<li class="match cq-spacer cq-spacer-' + i + '"></li>';
                    } else {
                        if (list_count == value.length - 1) {
                            if (cq_total == 1) {
                                html += '<li class="match cq-spacer cq-spacer-' + i + ' grow-fixed"></li>';
                            } else if (cq_total % 2 == 0) {
                                if (pattern.test(value2['roundName']) == true) {
                                    html += '<li class="match cq-spacer cq-spacer-' + i + ' grow-fixed"></li>';
                                } else {

                                }
                            }
                        }
                    }
                }
                list_count++;
            }

        })
        //if(i==2){return false;}
        html += ' </ul>';
    });
    if ((curobj2['matchUpStatus'] == 'COMPLETED' || curobj2['matchUpStatus'] == 'WALKOVER' || curobj2['matchUpStatus'] == 'RETIRED') && rr_total < 1) {
        html += ' <ul class="container col-sm-12 col-md bracket bracket-' + (curindex + 1) + '" data-round="WINNER" data-key="' + (curindex + 1) + '">';
        html += '<li class="match">';
        html += '<div class="player-spacer"></div>';
        html += '<div class="player" ';
        html += 'data-winner="true" ';
        html += ' >';
        html += '<span class="player_icon">';
        html += '<i class="fal fa-smile fa-lg bg-warning rounded-circle"></i></span>';
        html += '<span class="playername" ';
        if (curobj2['sides'][(curwinningSide - 1)]['seedNumber'] != undefined) {
            html += ' data-seednumber="' + curobj2['sides'][(curwinningSide - 1)]['seedNumber'] + '" ';
        }
        if (curobj2['matchUpStatus'] == 'WALKOVER') {
            html += ' data-score="' + curobj2['matchUpStatus'] + '" ';
        } else if (curobj2['matchUpStatus'] == 'RETIRED') {
            html += ' data-score="' + curobj2['matchUpStatus'] + ' ' + curscore + '" ';
        } else {
            html += ' data-score="' + curscore + '" ';
        }
        html += ' ><span class="nowrap">' + curobj2['sides'][(curwinningSide - 1)]['participant']['participantName'];
        if (curobj2['sides'][(curwinningSide - 1)]['seedNumber']) {
            html += '<span class="seed">' + curobj2['sides'][(curwinningSide - 1)]['seedNumber'] + '</span>';
        }
        html += '</span></span></div>';
        html += '<!--end of .player-->';
        html += '<div class="player-spacer"></div>';
        html += '</li>';
        html += ' </ul>';
    }else if((curobj2['matchUpStatus'] == 'CANCELLED') && rr_total < 1){
        //CANCELLED
        html += ' <ul class="container col-sm-12 col-md bracket bracket-' + (curindex + 1) + '" data-round="WINNER" data-key="' + (curindex + 1) + '">';
        html += '<li class="match">';
        html += '<div class="player-spacer"></div>';
        html += '<div class="player" ';
        html += ' >';
        html += '<span class="playername" data-score="'+curobj2['matchUpStatus']+'"';
        html += ' ><span class="nowrap"></span></span></div>';
        html += '<!--end of .player-->';
        html += '<div class="player-spacer"></div>';
        html += '</li>';
        html += ' </ul>';
    }
    if (curindex < 4) {
        html += '<div class="container col-md d-none d-sm-flex grow-2"></div>';
    }
    html += '</div>';
    //console.log(html);
    $('#drawcontainer').html(html);
}
}