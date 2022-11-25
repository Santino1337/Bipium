var request = require('request'),
    username = "santino_paradise@bk.ru",
    password = "21867so1995SAN",
    url = "https://santiparadise.bpium.ru/api/v1/catalogs/11/records/1",
    auth = "Basic " +  new Buffer.from(username + ":" + password).toString("base64");


var express = require('express'),
bodyParser = require('body-parser'),
app = express(),
port = 3000;

app.use(bodyParser.json());
// post запрос отправляемый с postman с json сообщением 
app.post('/', function (req, res) {
    var body = req.body;
    var event = body.webhook_message.event;
    console.log(event); // 200 || 400
    if(event == "run script"){
        changeComment()
        createRecord()        
    }

    res.json({
        message: 'ok got it!'
    });
});

var server = app.listen(port, function () {

    var host = server.address().address
    var port = server.address().port

    console.log('Example app listening at http://%s:%s', host, port)

});

function changeComment(){
    // дёргаем коментарий из внешнего сайта
    request.post(
        'https://test.bpium.ru/api/webrequest/request',
    { json: { key: 'value' } },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            newValue = body.value
            // изменение через запрос  
            request.patch(
                {
                    url : url,
                    headers : {
                        "Authorization" : auth
                    },
                    json: {
                        "values": {
                            "3": newValue
                        }
                    }
                },
                function (error, response, body) {
                    console.log(response.statusCode) 
                        if (!error && response.statusCode == 200) {
                            console.log(body)
                        }else{
                            console.log(error)
                        }
                }
            );
            
        }
    }
    );    
       
}

function createRecord(){

    request.post(
        'https://test.bpium.ru/api/webrequest/request',
    { json: { key: 'value' } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let newValue = body.value
                request.post(
                    "https://santiparadise.bpium.ru/api/v1/catalogs/11/records",
                    {
                        url : url,
                        headers : {
                            "Authorization" : auth
                        },
                        json: {
                            "values": {
                                "2": ["1"],
                                "3": newValue,
                            }
                        }
                    },
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {                
                            console.log('happy')
                            // создание записи в каталоге склад
                            request.post(
                                "https://santiparadise.bpium.ru/api/v1/catalogs/12/records",
                                {
                                    url : url,
                                    headers : {
                                        "Authorization" : auth
                                    },
                                    json: {
                                        "values": {
                                            "1": "2022-11-25T00:00:00.000Z",
                                            "2": [{ // связанный объект
                                                "catalogId": "11",
                                                "recordId": "1"
                                            }],
                                            "3": newValue,
                                        }
                                    }
                                }
                            )
            
                    }else{
                        console.log('ploxo')
                    }
                }
                );
                
            }
        }
    ); 
}

