/**
 * Created by chenjie on 2015/1/4.
 */


var excelParser = require('excel-parser');
//var excelExport = require('msexcel-builder');
var excelExport = require('node-xlsx');

var _ = require('underscore')
var async = require('async')
var path = require('path')
var fs = require('fs')

function parseExcelFile(fileName, callback){
    if (!fileName){
        return callback('excel fileName not exists')
    }

    var result = []
    var parseDataInWorkSheets = function(sheetId, done){
        excelParser.parse({
            inFile: fileName,
            worksheet: sheetId
            //skipEmpty: true
            /*searchFor: {
                term: ['7c3c8cf52f66fa27'],
                type: 'loose'
            }*/
        },function(err, records){
            if(err){
                done(err);
            } else {
                done(null, records)
            }
        });
    }

    var parseWorkSheets = function(){
        excelParser.worksheets({
            inFile: fileName
        }, function(err, worksheets){
            if (err){
                callback(err)
            } else {
                getWorkSheetData(worksheets)
            }
        });
    }

    var getWorkSheetData = function(worksheets){
        async.eachSeries(worksheets, function(worksheet, done){
            parseDataInWorkSheets(worksheet.id, function(err, data){
                if (err){
                    done(err)
                } else {
                    result.push({name: worksheet.name, data: data})
                    done();
                }
            })
        }, function(err){
            if (err){
                callback(err)
            } else{
                callback(null, result)
            }
        })
    }

    parseWorkSheets();
}

exports.postFile = function(req, res){
    var excel = req.files.excel
    if (!excel){
        return res.send(400, 'excel file not exists');
    }

    parseExcelFile(excel.path, function(err, data){
        if (err){
            console.log(err)
            res.send(500, err)
        } else {
            res.send(data);
        }
    })
}

exports.exportFile = function(sheets, done){
    try {
        var buffer = excelExport.build(sheets, {});
        done(null, buffer)
    } catch(e){
        console.log(e)
        done('parse sheets err:' + e)
    }
}