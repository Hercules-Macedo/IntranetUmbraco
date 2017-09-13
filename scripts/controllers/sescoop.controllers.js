/// <reference path="../views/pessoas/template.modal.pessoa.html" />
/// <reference path="../views/pessoas/template.modal.pessoa.html" />
/* Controller Home */
app.controller('HomeCtrl', function ($scope, $rootScope, $http) {
    $scope.lista = {};
    $scope.videos = {};
    $scope.show = false;
    $scope.abrirNoticias = function () {
        window.location = "/publicacoes/noticias";
    };
    $scope.colorir = function () {
        var elm = document.querySelectorAll('*');
        for (var i = 0; i < elm.length; i++) {
            elm[i].style.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        }
    };
    $scope.$on('$includeContentLoaded', function () {
        $http.get("https://www.googleapis.com/youtube/v3/search?key=AIzaSyC0cCJVNF7NKsYE2OETpQ_Y6WDopn9J2a8&channelId=UC8aj_dP-vzPu5M0kh39quAA&part=snippet,id&order=date&maxResults=20").then(function (data) {
            $scope.videos = data.data;
            $('#ytVideoIframe').attr('src', $("#HomeVideo").val() ? $("#HomeVideo").val() : ('https://www.youtube.com/embed/' + data.data.items[0].id.videoId));
        });

        $scope.setYTVideo = function (item) {
            $('#ytVideoIframe').attr('src', 'https://www.youtube.com/embed/' + item.id.videoId);
        };
    });

    $scope.LoginsAgregados = function (data) {
        
        //for (var i = 0; i < data.length; i++) {
        //    var pic = data[i].Properties.$values[9].Value;
        //    data[i]["pic"] = JSON.parse(pic);
        //    data[i]["cargo"] = data[i].Properties.$values[12].Value;
        //}

        $rootScope.usuariosAgregados = data;
        $("#modal-login-agragado").modal("show");
    };

    $scope.loginSelecionado = {};
    $scope.LoginAgregadoSelecionar = function (item, elem) {
        $scope.loginSelecionado = item;
        $("#form-login-agregado #login").val(item.Username);
        $("#form-login-agregado #senha").focus();
    };

});

app.controller('WeatherCtrl', function ($scope, $http) {
    $scope.weather = {};
    $scope.weather.addDay = function (i) {
        return moment().add(i, 'days').format("ddd , DD MMM");;
    };
    $scope.weather.lista = function () {
        $http.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22Sao%20Paulo%2C%20SP%22)%20and%20u%3D\'c\'&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=')
        .success(function (data) {
            $scope.weatherData = data.query.results.channel;
        })
        .error(function (err) {
            console.log('Error retrieving markets');
        });
    };
});

app.directive('helloWorld', function () {
    return {
        restrict: 'AE',
        replace: 'true',
        template: '<h3>Hello World!!</h3>'
    };
});


/* Controller Profile */
app.controller('sescoop.controllers.member.profile', function ($scope) {

    $scope.member = {};
    $scope.member.nome = "";
    $scope.member.profile = "http://localhost:51549/media/1007/10543071_10152632538930929_595768551192289654_n.jpg?center=0.21301775147928995,0.87713310580204773&mode=crop&width=400&height=330&rnd=131146512520000000";
    $scope.member.imageArea = "http://www.hisdcareerreadiness.org/wp-content/uploads/2015/07/icon-it-L.png";
    $scope.member.area = "Tecnologia da Informação";
    $scope.member.ramal = "3323";
    $scope.member.email = "jose.braz@gmail.com";

});


/* Controller Pessoa */
app.controller('sescoop.controllers.pessoa', function ($scope, $http, $timeout, ShowInfoService) {

    $scope.today = new Date();
    $scope.show = false;
    $scope.showDialog = false;

    $scope.cssItens = "animate-it";
    $scope.onRepeatFinish = function () {

        triggerAnimate(function () {
            $scope.cssItens = "";
        });
    }

    //setInterval("console.log(ShowInfoService.member)", 1000);

    $scope.lista = {};
    $scope.lista.aniversariantes = function () {
        $http.post("/Umbraco/Api/Pessoa/Aniversariantes").then(function (response) {
            $scope.itens = response.data;
		    $scope.show = true;
		    $timeout(function () { $('[data-toggle="tooltip"]').tooltip() }, 100);
		});
    };

    $scope.lista.aniversariantesDoDia = function () {
        $http.post("/Umbraco/Api/Pessoa/AniversariantesDoDia").then(function (response) {
            $scope.itens = response.data;
            $scope.show = true;
        });
    };

    $scope.lista.emailsRamais = function () {
        $http.post("/Umbraco/Api/Pessoa/EmailsRamais").then(function (response) {
	      $scope.itens = response.data;
	      $scope.show = true;
	      $timeout(function () { $('[data-toggle="tooltip"]').tooltip() }, 100);
	  });
    };

    $scope.lista.brigada = function () {
        $http.post("/Umbraco/Api/Pessoa/Brigada")
	  .then(function (response) {

	      var data = response.data;
	      var retorno = [];
	      for (var i = 0; i < data.length; i++)
	      {
	          var role = data[i].role;
	          for (var j = 0; j < data[i].usuarios.length; j++) {
	              var usuario = data[i].usuarios[j];
	              usuario.roles = [role];
	              retorno.push(usuario);
	          }
	      }

	      $scope.itens = retorno;
	      $scope.show = true;
	      $timeout(function () { $('[data-toggle="tooltip"]').tooltip() }, 100);
	  });
    };

    $scope.lista.admissoes = function () {
        $http.post("/Umbraco/Api/Pessoa/Admissoes")
	  .then(function (response) {
	      $scope.itens = response.data;
	      $scope.show = true;
	      $timeout(function () { $('[data-toggle="tooltip"]').tooltip() }, 100);
	  });
    };

    $scope.lista.desligamentos = function () {
        $http.post("/Umbraco/Api/Pessoa/Desligamentos")
	  .then(function (response) {
	      $scope.itens = response.data;
	      $scope.show = true;
	      $timeout(function () { $('[data-toggle="tooltip"]').tooltip() }, 100);
	  });
    };

    $scope.lista.ferias = function () {
        $http.post("/Umbraco/Api/Pessoa/Ferias")
	  .then(function (response) {
	      $scope.itens = response.data;
	      $scope.show = true;
	      $timeout(function () { $('[data-toggle="tooltip"]').tooltip() }, 100);
	  });
    };

    $scope.lista.transferencias = function () {
        //
        $http.get("/Umbraco/Api/Pessoa/Transferencias")
        .then(function (response) {
            $scope.itens = response.data;
            $scope.show = true;
        });
    };

    $scope.member = {};
    $scope.info = function (m) {
        $scope.member = m;
        $scope.modalVisible = !$scope.modalVisible;
    };

    $scope.bgPic = function (m) {

        if (m.roles.indexOf("Equipe de Abandono") != -1) {
            return "/media/images/equipe-abandono-card.png";
        }

        if (m.roles.indexOf("Brigada de Incendio") != -1) {
            return "/media/images/brigada-incendio-card.png";
        }

        if (m.roles.indexOf("Socorristas") != -1) {
            return "/media/images/socorrista-card.png";
        }

        return "";

    };

    $scope.pagining = { pageIndex: 0, pageSize: 2, totalRecords: 0, orderBy: "Name", orderDirection: 1, filter: "" };

    $scope.changePage = function (p) {
        $scope.pagining.pageIndex = p;
        $scope.lista.listarPessoas();
    };

    $scope.totalPages = function () {
        var i = Math.ceil($scope.pagining.totalRecords / $scope.pagining.pageSize);
        return $scope.range(i);
    };

    $scope.range = function (start, end) {
        var ret = [];
        if (!end) {
            end = start;
            start = 0;
        }
        for (var i = start; i < end; i++) {
            ret.push(i);
        }
        return ret;
    };

    $scope.prevPage = function () {
        if ($scope.pagining.pageIndex > 0) {
            $scope.pagining.pageIndex--;
            $scope.lista.listarPessoas();
        }
    };

    $scope.nextPage = function () {
        if ($scope.pagining.pageIndex < $scope.totalPages().length - 1) {
            $scope.pagining.pageIndex++;
            $scope.lista.listarPessoas();
        }
    };


    /** modal **/
    $scope.showModal = function (item) {

        $scope.opts = {
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            templateUrl: '/views/pessoas/template.modal.pessoa.html',
            controller: function ($scope, $modalInstance, $modal, item) {

                $scope.item = item;

                $scope.ok = function () {
                    $modalInstance.close();
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            },
            resolve: {} // empty storage
        };


        $scope.opts.resolve.item = function () {
            return angular.copy({ member: $scope.item }); // pass name to resolve storage
        }

        var modalInstance = $modal.open($scope.opts);

        modalInstance.result.then(function () {
            //on ok button press 
        }, function () {
            //on cancel button press
            console.log("Modal Closed");
        });
    };
});


/* Controller Noticias */
app.controller('sescoop.controllers.noticias', function ($scope, $http) {

    $scope.today = new Date();
    $scope.show = false;

    $scope.lista = {};


    $scope.lista.listarNoticias = function () {
        $http.post("/Umbraco/Api/Noticia/ListarNoticias", $scope.pagining)
	  .then(function (response) {
	      $scope.pagining = response.data.pag;
	      $scope.itens = response.data.data;
	      $scope.show = true;
	      $('.lista-noticia').removeClass("animated fadeOut");
	      $('.lista-noticia').addClass('animated fadeIn');
	  });
    };

    $scope.lista.listarUltimasNoticias = function (total) {

        $scope.show = false;

        $http.post("/Umbraco/Api/Noticia/ListarUltimasNoticias", $scope.pagining).then(function (response) {
            $scope.pagining = response.data.pag;
            $scope.itens = response.data.data;
            $scope.show = true;
        });
    };

    $scope.pagining = { pageIndex: 0, pageSize: 6, totalRecords: 0, orderBy: "CreateDate", orderDirection: 1, filter: "" };

    $scope.changePage = function (p) {
        $('.lista-noticia').removeClass("animated fadeIn");
        $('.lista-noticia').addClass('animated fadeOut');
        $scope.pagining.pageIndex = p;
        $scope.lista.listarNoticias();
    };

    $scope.totalPages = function () {
        var i = Math.ceil($scope.pagining.totalRecords / $scope.pagining.pageSize);
        return $scope.range(i);
    };

    $scope.range = function (start, end) {
        var ret = [];
        if (!end) {
            end = start;
            start = 0;
        }
        for (var i = start; i < end; i++) {
            ret.push(i);
        }
        return ret;
    };

    $scope.prevPage = function () {
        if ($scope.pagining.pageIndex > 0) {
            $scope.pagining.pageIndex--;
            $scope.lista.listarNoticias();
        }
    };

    $scope.nextPage = function () {
        if ($scope.pagining.pageIndex < $scope.totalPages().length - 1) {
            $scope.pagining.pageIndex++;
            $scope.lista.listarNoticias();
        }
    };

});

/* Service Pessoa */
app.service('ShowInfoService', function () {
    this.member = {};
});


/* Controller Calendar CalendarDemoCtrl */
app.controller('CalendarDemoCtrl', ['$scope', '$http', function ($scope, $http) {
    //'use strict';
    $scope.changeMode = function (mode) {
        $scope.mode = mode;
    };

    $scope.today = function () {
        $scope.currentDate = new Date();
    };

    $scope.isToday = function () {
        var today = new Date(),
			currentCalendarDate = new Date($scope.currentDate);

        today.setHours(0, 0, 0, 0);
        currentCalendarDate.setHours(0, 0, 0, 0);
        return today.getTime() === currentCalendarDate.getTime();
    };

    $scope.loadEvents = function (start, end) {
        //$scope.eventSource = createRandomEvents();
        $http.post("/Umbraco/Api/Agenda/ListarAgenda", {
            de: start,
            ate: end
        }).then(function (response) {
            $scope.itens = response.data.data;
            var events = [];

            for (var i = 0; i < response.data.data.length; i++)
            {
                var inicio = moment(response.data.data[i].inicioDoEvento).utc();
                var termino = moment(response.data.data[i].terminoDoEvento).utc();

                var allDay = false;

                if (inicio.date() != termino.date())
                    allDay = true;

                events.push({
                    Id: response.data.data[i].Id,
                    Url: response.data.data[i].Url,
                    title: response.data.data[i].tituloDoEvento,
                    startTime: moment(response.data.data[i].inicioDoEvento).utc()._i,
                    endTime: moment(response.data.data[i].terminoDoEvento).utc()._i,
                    allDay: allDay
                });
            }

            $scope.eventSource = events;

            $scope.show = true;
        });
    };

    $scope.startEvents = function () {

        $scope.loadEvents( new Date(2016, 01, 01), new Date(2030, 01, 01));

        //$scope.loadEvents(moment().date(1).format("YYYY-MM-DD HH:mm:ss"), moment().endOf('month').format("YYYY-MM-DD HH:mm:ss"));
    };

    $scope.onEventSelected = function (event) {
        $scope.event = event;
    };

    $scope.onTimeSelected = function (selectedTime) {
        console.log('Selected time: ' + selectedTime);
    };

    $scope.rangeChanged = function (startTime, endTime) {
        console.log("rangeChanged");
        $scope.loadEvents(startTime, endTime);
    };

    function createRandomEvents() {
        var events = [];
        for (var i = 0; i < 50; i += 1) {
            var date = new Date();
            var eventType = Math.floor(Math.random() * 2);
            var startDay = Math.floor(Math.random() * 90) - 45;
            var endDay = Math.floor(Math.random() * 2) + startDay;
            var startTime;
            var endTime;
            if (eventType === 0) {
                startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
                if (endDay === startDay) {
                    endDay += 1;
                }
                endTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + endDay));
                events.push({
                    title: 'All Day - ' + i,
                    startTime: startTime,
                    endTime: endTime,
                    allDay: true
                });
            } else {
                var startMinute = Math.floor(Math.random() * 24 * 60);
                var endMinute = Math.floor(Math.random() * 180) + startMinute;
                startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + startDay, 0, date.getMinutes() + startMinute);
                endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + endDay, 0, date.getMinutes() + endMinute);
                events.push({
                    title: 'Event - ' + i,
                    startTime: startTime,
                    endTime: endTime,
                    allDay: false
                });
            }
        }
        return events;
    }
}]);



/* Controller Veiculo */
app.factory('reservaVeiculosResource',
    function ($q, $http) {

        var apiCallsFactory = {};

        apiCallsFactory.MinhasReservas = function ($parameters) {
            return $http.post("/Umbraco/Api/ReservaVeiculos/MinhasReservas");
        };

        apiCallsFactory.Reservar = function ($parameters) {
            return $http.post("/Umbraco/Api/ReservaVeiculos/Reservar", $parameters);
        };

        apiCallsFactory.VeiculosDisponiveis = function ($p) {
            return $http.post("/Umbraco/Api/ReservaVeiculos/VeiculosDisponiveis", $p);
        };

        apiCallsFactory.CancelarReserva = function ($p) {
            return $http.post("/Umbraco/Api/ReservaVeiculos/CancelarReserva/" + $p);
        };

        return apiCallsFactory;
    }
);

app.controller('sescoop.controllers.sistemas.reservaVeiculos', function ($scope, $http, $timeout, reservaVeiculosResource) {

    $scope.pag = { currentPage: 1, pageSize: 10, totalRecords: 0, totalPages: 0, orderBy: "R.Id", orderDirection: 1, filter: null };

    $scope.MinhasReservas = {};
    $scope.MinhasReservas.lista = {};
    $scope.MinhasReservas.lista.model = {};
    $scope.MinhasReservas.lista.pag = $scope.pag;
    $scope.MinhasReservas.lista.Pesquisar = function () {

        $scope.MinhasReservas.lista.pag.filter = $scope.MinhasReservas.lista.model;
        $scope.MinhasReservas.lista.pag.rows = {};

        $http.post("/Umbraco/Surface/ReservaVeiculosSurface/Pesquisar", $scope.MinhasReservas.lista.pag).then(function (response) {
            $scope.MinhasReservas.lista.pag = response.data;
            $scope.MinhasReservas.lista.data = response.data.rows;
            $timeout(function () { $('[data-toggle="tooltip"]').tooltip() }, 100);
            //$("#grid-selection").parent().parent().animateCss('fadeInDown');
        }, function (error) {
            ShowMessage($scope, error.statusText, "danger");
        });
    };

    $scope.Reservas = {};
    $scope.Reservas.lista = {};
    $scope.Reservas.lista.model = {};
    $scope.Reservas.lista.pag = { currentPage: 1, pageSize: 10, totalRecords: 0, totalPages: 0, orderBy: "R.Id", orderDirection: 1, filter: null };
    $scope.Reservas.lista.Pesquisar = function () {

        $scope.Reservas.lista.pag.filter = $scope.Reservas.lista.model;
        $scope.Reservas.lista.pag.rows = {};

        $http.post("/Umbraco/Surface/ReservaVeiculosSurface/Pesquisar", $scope.Reservas.lista.pag).then(function (response) {
            $scope.Reservas.lista.pag = response.data;
            $scope.Reservas.lista.data = response.data.rows;
            $timeout(function () { $('[data-toggle="tooltip"]').tooltip() }, 100);
            //$("#grid-selection").parent().parent().animateCss('fadeInDown');
        }, function (error) {
            ShowMessage($scope, error.statusText, "danger");
        });
    };

    $scope.Veiculos = {};
    $scope.Veiculos.Pesquisar = function () {
        $http.post("/Umbraco/Surface/ReservaVeiculosSurface/PesquisarVeiculos", $scope.Reservas.lista.pag).then(function (response) {

        });
    };

    //
    $scope.Manutencao = {};
    $scope.Manutencao.lista = {};
    $scope.Manutencao.lista.model = {};
    $scope.Manutencao.lista.pag = { currentPage: 1, pageSize: 10, totalRecords: 0, totalPages: 0, orderBy: "M.Id", orderDirection: 1, filter: null };
    $scope.Manutencao.lista.Pesquisar = function () {

        $scope.Manutencao.lista.pag.filter = $scope.Manutencao.lista.model;
        $scope.Manutencao.lista.pag.rows = {};

        $http.post("/Umbraco/Surface/ReservaVeiculosSurface/PesquisarManutencao", $scope.Manutencao.lista.pag).then(function (response) {
            $scope.Manutencao.lista.pag = response.data;
            $scope.Manutencao.lista.data = response.data.rows;
            $timeout(function () { $('[data-toggle="tooltip"]').tooltip() }, 100);
            //$("#grid-selection").parent().parent().animateCss('fadeInDown');
        }, function (error) {
            ShowMessage($scope, error.statusText, "danger");
        });
    };

    $scope.Manutencao.ModalManutencaoNovo = function () {
        $('#modalVeiculoManutencao').modal('show');
    };
    $scope.Manutencao.ModalManutencaoExcluir = function (item) {
        $scope.vw = item; //
        $('#form-veiculo-manutencao-excluir input[type="hidden"]#Value').val(item.Id);
        $('#modalVeiculoManutencaoExcluir').modal('show');
    }

    $scope.ModalVeiculoReservar = function (item)
    {
        $scope.vw = item;
        
        $('#form-veiculo-reserva input[type="hidden"]#VeiculoId').val(item.Id);
        $('#form-veiculo-reserva #ReservaDe').val(moment(item.Data).format('DD/MM/YYYY'));
        $('#form-veiculo-reserva #ReservaAte').val(moment(item.Data).format('DD/MM/YYYY'));
        $('#modalVeiculoReserva').modal('show');
    };
    $scope.ModalVeiculoIniciar = function (item) {
        $scope.vw = item;
        $('#form-veiculo-iniciar input[type="hidden"]#ReservaId').val(item.ReservaId);
        $('#modalVeiculoIniciar').modal('show');
    };
    $scope.ModalVeiculoCancelar = function (item) {
        $scope.vw = item;
        $('#form-veiculo-cancelar input[type="hidden"]#Id').val(item.ReservaId);
        $('#modalVeiculoCancelar').modal('show');
    };
    $scope.ModalVeiculoFinalizar = function (item) {
        $scope.vw = item;
        $('#form-veiculo-finalizar input[type="hidden"]#ReservaId').val(item.ReservaId);
        $('#modalVeiculoFinalizar').modal('show');
    };
    $scope.ModalVeiculoReservaVisualizar = function (a, b) {
        bootbox.alert({
            title: "Dados da Reserva",
            message: "Reservado: <strong>{0}</strong> por <strong>{1}</strong>".format(a, b),
            backdrop: true
        });
    }

    $scope.ShowIniciar = function (item) {

        return item.statusReserva == 1;

        var today = new moment();
        var reservaDe = new moment(item.reservaDe, 'YYYY-MM-DD HH:mm');
        var reservaAte = new moment(item.reservaAte, 'YYYY-MM-DD HH:mm');
        var range = moment().range(reservaDe, reservaAte);

        return range.contains(today) && item.statusReserva == 1;//Confirmado
    };
    $scope.ShowCancelar = function (item) {
        return item.statusReserva == 1;
    };
    $scope.ShowAndamento = function (item) {
        return item.statusReserva == 2;

        var today = new moment();
        var reservaAte = new moment(item.reservaAte);
        return reservaAte <= today && item.statusReserva == 2;//Andamento
    };

});

/* Controller Comunicacao Interna CI */
app.controller('sescoop.controllers.ci', function ($scope, $http,$timeout, $sce, $q) {

    $scope.pag = { currentPage: 1, pageSize: 10, totalRecords: 0, totalPages: 0, orderBy: "C.Id", orderDirection: 1, filter: null };
    $scope.pag_por_area = { currentPage: 1, pageSize: 10, totalRecords: 0, totalPages: 0, orderBy: "C.Id", orderDirection: 1, filter: null };

    $scope.verificaItem = function (item) {
        return $scope.lista.pag.pageSize == item;
    };

    $scope.lista = {};
    $scope.lista.model = {};
    $scope.lista.model_por_area = { "protocolo": null, "para": null, "assunto": null, "dataCadastro": null};
    $scope.lista.pag = $scope.pag;
    $scope.lista.pag_por_area = $scope.pag_por_area;
    $scope.lista.Pesquisar = function () {

        $scope.lista.pag.filter = $scope.lista.model;
        $http.post("/Umbraco/Surface/ComunicacaoInternaSurface/Pesquisar", $scope.lista.pag).then(function (response) {
            $scope.lista.pag = response.data;
            $scope.lista.data = response.data.rows;
            $timeout(function () { $('[data-toggle="tooltip"]').tooltip() }, 100);
            //$("#grid-selection").parent().parent().animateCss('fadeInDown');
        }, function (error) {
            ShowMessage($scope, error.statusText, "danger");
        });
    };

    $scope.lista.PesquisarPorArea = function () {

        $scope.lista.pag_por_area.filter = $scope.lista.model_por_area;
        $http.post("/Umbraco/Surface/ComunicacaoInternaSurface/PesquisarPorArea", $scope.lista.pag_por_area).then(function (response) {
            $scope.lista.pag_por_area = response.data;
            $scope.lista.data_por_area = response.data.rows;
            $timeout(function () { $('[data-toggle="tooltip"]').tooltip() }, 100);
            //$("#grid-selection").parent().parent().animateCss('fadeInDown');
        }, function (error) {
            ShowMessage($scope, error.statusText, "danger");
        });
    };

    var areas = [];
    $scope.lista.listarAreas = function () {
        $http.get("/Umbraco/Api/Area/TodasAreas", $scope.lista.pag).then(function (response) {
            $scope.areas = response.data;

            for (var i = 0; i < $scope.areas.length; i++) {
                //var selected = $scope.areas[i].area == $('hidden[name="hdArea"]').val() ? "selected='selected'" : "";
                $('select[name="Area"]').append("<option value='" + $scope.areas[i].area + "'>" + $scope.areas[i].area + "</option>");
            }

            $('select[name="Area"] option[value="' + $('[name="hdArea"]').val() + '"]').prop("selected", "selected");
            $scope.change_area({ "Area": $('[name="hdArea"]').val() });

        }, function (error) {
            ShowMessage($scope, error.statusText, "danger");
        })
    }

    $scope.change_area = function (item) {
        console.log(item.Area);
        $("select[name='Departamento']").empty();
        $("select[name='Departamento']").append("<option value='' selected>TODOS</option>");
        for (var i = 0; i < $scope.areas.length; i++) {
            if($scope.areas[i].area == item.Area){
                for (var j = 0; j < $scope.areas[i].departamentos.length; j++)
                {
                    $("select[name='Departamento']").append("<option value='" + $scope.areas[i].departamentos[j] + "'>" + $scope.areas[i].departamentos[j] + "</option>");
                }
                $('select[name="Departamento"] option[value="' + $('[name="hdDepartamento"]').val() + '"]').prop("selected", "selected");
            }
        }
    };

    $scope.lista.listarAreas();
    


    $scope.buildEditor = function () {
        $('#summernote').summernote('destroy');

        $('#form-ci #summernote').html( $('#form-ci input[type="hidden"]#Descricao').val() );
        $('#form-ci #summernote').summernote({
            height: 500,                 // set editor height
            minHeight: null,             // set minimum height of editor
            maxHeight: null,             // set maximum height of editor
            focus: true,                  // set focus to editable area after initializing summernote
            codemirror: { // codemirror options
                theme: 'default'
            },
            callbacks: {
                onChange: function (contents, $editable) {
                    console.log('onChange:', contents, $editable);
                    $('#form-ci input[type="hidden"]#Descricao').val(contents);
                }
            }
        });
    };

    $scope.Excluir = function (item) {

        bootbox.confirm({
            message: "Deseja realmente excluir o CI <strong>" + item.assunto + "</strong> ?",
            buttons: {
                confirm: {
                    label: 'Sim',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'Não',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result) {
                    $http.post("/Umbraco/Surface/ComunicacaoInternaSurface/Excluir", { Value: item.Id }).then(function (response) {
                        $scope.lista.Pesquisar();
                    });
                }
            }
        });

        
    };

});

/* Controller Reserva de Salas */
app.controller('sescoop.controllers.sistemas.reservaSalas', function ($scope, $http, $timeout) {

    $scope.pag = { currentPage: 1, pageSize: 10, totalRecords: 0, totalPages: 0, orderBy: "R.Id", orderDirection: 1, filter: null };

    $scope.verificaItem = function (item) {
        return $scope.lista.pag.pageSize == item;
    };

    $scope.lista = {};
    $scope.lista.model = {};
    $scope.lista.pag = localStorage.getItem("sala-reservas-pag") == null ? $scope.pag : JSON.parse(localStorage.getItem("sala-reservas-pag"));
    $scope.lista.Pesquisar = function () {
        $scope.lista.pag.exportar = false;
        $scope.lista.pag.filter = $scope.lista.model;
        localStorage.setItem("sala-reservas-pag", JSON.stringify($scope.lista.pag));

        $http.post("/Umbraco/Surface/ReservaSalasSurface/Pesquisar", $scope.lista.pag).then(function (response) {
            $scope.lista.pag = response.data;
            $scope.lista.data = response.data.rows;
            $timeout(function () { $('[data-toggle="tooltip"]').tooltip() }, 100);
            //$("#grid-selection").parent().parent().animateCss('fadeInDown');
        }, function (error) {
            ShowMessage($scope, error.statusText, "danger");
        });
    };

    $scope.lista.Exportar = function () {
        $scope.lista.pag.exportar = true;
        $scope.lista.pag.filter = $scope.lista.model;

        $http.post("/Umbraco/Surface/ReservaSalasSurface/Pesquisar", $scope.lista.pag).then(function (response) {
            console.log("Exportar");
            window.open(response.data.path, "_blank","","");
        }, function (error) {
            ShowMessage($scope, error.statusText, "danger");
        });
    };

    $scope.lista.PesquisarInadimplentes = function () {

        $scope.lista.pag.filter = $scope.lista.model;

        $http.post("/Umbraco/Surface/ReservaSalasSurface/PesquisarInadimplentes", $scope.lista.pag).then(function (response) {
            $scope.lista.pag = response.data;
            $scope.lista.data = response.data.rows;

            $timeout(function () { $('[data-toggle="tooltip"]').tooltip() }, 100);

            //$("#grid-selection").parent().parent().animateCss('fadeInDown');
        }, function (error) {
            ShowMessage($scope, error.statusText, "danger");
        });
    };

    $scope.ShowIniciar = function (item) {
        var today = new moment();
        var reservaDe = new moment(item.ReservaDe);
        var reservaAte = new moment(item.ReservaAte);
        var range = moment().range(reservaDe, reservaAte);

        return range.contains(today) && item.StatusSalaReserva == 1;//Confirmado
    };
    $scope.ShowCancelar = function (item) { return item.StatusSalaReserva == 1; };
    $scope.ShowAndamento = function (item) {
        var today = new moment();
        var reservaAte = new moment(item.ReservaAte);
        return reservaAte <= today && item.StatusSalaReserva == 2;//Andamento
    };

    $scope.ShowDiasAtrazados = function (item) {
        var today = new moment();
        var reservaAte = new moment(item.ReservaAte);
        if (reservaAte <= today && item.StatusSalaReserva == 2) {
            return (today.diff(reservaAte, 'days') + 1) + " dias";
        }
        return "";
    };

    $scope.ModalSalaReservarEditar = function (item) {
        $scope.vw = item;
        $http.get("/Umbraco/Surface/ReservaSalasSurface/Editar/?id=" + item.ReservaId)
        .then(function (response) {
            $('#modalSalaReserva').html(response.data);
            $('#modalSalaReserva').modal('show');
        });
    };
    $scope.ModalSalaReservar = function (item) {
        $scope.vw = item;
        $('#form-sala-reserva input[type="hidden"]#SalaId').val(item.Id);
        $('#form-sala-reserva p.nome-sala').html(item.Descricao);
        $('#form-sala-reserva #ReservaDe').val(moment(item.Data).format('DD/MM/YYYY'));
        $('#form-sala-reserva #ReservaAte').val(moment(item.Data).format('DD/MM/YYYY'));
        $('#modalSalaReserva').modal('show');
    };
    $scope.ModalSalaIniciar = function (item)
    {
        $scope.vw = item;
        $('#form-sala-iniciar input[type="hidden"]#Id').val(item.Id);
        $('#modalSalaIniciar').modal('show');
    };
    $scope.ModalSalaCancelar = function (item)
    {
        $scope.vw = item;
        $('#form-sala-cancelar input[type="hidden"]#Id').val(item.Id);
        $('#modalSalaCancelar').modal('show');
    };
    $scope.ModalSalaFinalizar = function (item)
    {
        $scope.vw = item;
        $('#form-sala-finalizar input[type="hidden"]#Id').val(item.Id);
        $('#modalSalaFinalizar').modal('show');
    };

    $scope.ModalSalaReservaVisualizar = function (a, b) {
        bootbox.alert({
            title: "Dados da Reserva",
            message: "Reservado: <strong>{0}</strong> por <strong>{1}</strong>".format(a, b),
            backdrop: true
        });
    }

});

/* Controller Reserva de Equipamentos */
app.controller('sescoop.controllers.sistemas.reservaEquipamentos', function ($scope, $http, $timeout) {

    $scope.pag = { currentPage: 1, pageSize: 10, totalRecords: 0, totalPages: 0, orderBy: "R.Id", orderDirection: 1, filter: null };

    $scope.lista = {};
    $scope.lista.model = {};
    $scope.lista.pag = localStorage.getItem("equipamentos-reservas-pag") == null ? $scope.pag : JSON.parse(localStorage.getItem("equipamentos-reservas-pag"));
    $scope.lista.Pesquisar = function () {

        $scope.lista.pag.exportar = false;
        $scope.lista.pag.filter = $scope.lista.model;
        $scope.lista.pag.rows = {};
        localStorage.setItem("equipamentos-reservas-pag", JSON.stringify($scope.lista.pag));

        $http.post("/Umbraco/Surface/ReservaEquipamentosSurface/Pesquisar", $scope.lista.pag).then(function (response) {
            $scope.lista.pag = response.data;
            $scope.lista.data = response.data.rows;
            $timeout(function () { $('[data-toggle="tooltip"]').tooltip() }, 100);
            //$("#grid-selection").parent().parent().animateCss('fadeInDown');
        }, function (error) {
            ShowMessage($scope, error.statusText, "danger");
        });
    };
    $scope.lista.Exportar = function () {
        $scope.lista.pag.exportar = true;
        $scope.lista.pag.filter = $scope.lista.model;
        $scope.lista.pag.rows = {};
        localStorage.setItem("equipamentos-reservas-pag", JSON.stringify($scope.lista.pag));

        $http.post("/Umbraco/Surface/ReservaEquipamentosSurface/Pesquisar", $scope.lista.pag).then(function (response) {
            console.log("Exportar");
            window.open(response.data.path, "_blank", "", "");
        }, function (error) {
            ShowMessage($scope, error.statusText, "danger");
        });
    };

    $scope.ShowIniciar = function (item) {
        var today = new moment();
        var reservaDe = new moment(item.reservaDe);
        var reservaAte = new moment(item.reservaAte);
        var range = moment().range(reservaDe, reservaAte);

        return range.contains(today) && item.statusEquipamentoReserva == 1;//Confirmado
    };
    $scope.ShowCancelar = function (item) { return item.statusEquipamentoReserva == 1; };
    $scope.ShowAndamento = function (item) {
        var today = new moment();
        var reservaAte = new moment(item.reservaAte);
        return reservaAte <= today && item.statusEquipamentoReserva == 2;//Andamento
    };
    

    $scope.lista.PesquisarInadimplentes = function () {

        $scope.lista.pag.filter = $scope.lista.model;

        $http.post("/Umbraco/Surface/ReservaEquipamentosSurface/PesquisarInadimplentes", $scope.lista.pag).then(function (response) {
            $scope.lista.pag = response.data;
            $scope.lista.data = response.data.rows;

            $timeout(function () { $('[data-toggle="tooltip"]').tooltip() }, 100);

            //$("#grid-selection").parent().parent().animateCss('fadeInDown');
        }, function (error) {
            ShowMessage($scope, error.statusText, "danger");
        });
    };

    $scope.ModalEquipamentoReservar = function (item) {
        $scope.vw = item;
        $('#form-equipamento-reserva input[type="hidden"]#EquipamentoId').val(item.Id);
        $('#form-equipamento-reserva #ReservaDe').val(moment(item.Data).format('DD/MM/YYYY'));
        $('#form-equipamento-reserva #ReservaAte').val(moment(item.Data).format('DD/MM/YYYY'));
        $('#modalEquipamentoReserva').modal('show');
    };
    $scope.ModalEquipamentoIniciar = function (item) {
        $scope.vw = item;
        $('#form-equipamento-iniciar input[type="hidden"]#Id').val(item.ReservaId);
        $('#modalEquipamentoIniciar').modal('show');
    };
    $scope.ModalEquipamentoCancelar = function (item) {
        $scope.vw = item;
        $('#form-equipamento-cancelar input[type="hidden"]#Id').val(item.ReservaId);
        $('#modalEquipamentoCancelar').modal('show');
    };
    $scope.ModalEquipamentoFinalizar = function (item) {
        $scope.vw = item;
        $('#form-equipamento-finalizar input[type="hidden"]#Id').val(item.ReservaId);
        $('#modalEquipamentoFinalizar').modal('show');
    };

    $scope.ModalEquipamentoReservaVisualizar = function (a, b) {
        bootbox.alert({
            title: "Dados da Reserva",
            message: "Reservado: <strong>{0}</strong> por <strong>{1}</strong>".format(a, b),
            backdrop: true
        });
    }

    $scope.equipamentos = {};
    $scope.equipamentos.mostrar = { Id: 1 };

});

/* Controller Solicitação de Adiantamentos */
app.controller('sescoop.controllers.sistemas.solicitacao_adiantamentos', function ($scope, $http, $timeout, $sce, $q) {

    $scope.pag = { currentPage: 1, pageSize: 10, totalRecords: 0, totalPages: 0, orderBy: "A.Id", orderDirection: 1, filter: null };
    $scope.verificaItem = function (item) {
        return $scope.lista.pag.pageSize == item;
    };
    $scope.filtros = [
        { value: 'A.Id', text: 'Id' },
        { value: 'A.motivo', text: 'Motivo' },
        { value: 'A.localidade', text: 'Localidade' },
        { value: 'A.periodoViagemDe', text: 'De' },
        { value: 'A.periodoViagemAte', text: 'Até' },
        { value: 'M.LoginName', text: 'Login' },
        { value: 'M.Email', text: 'Email' }
    ];

    $scope.lista = {};
    $scope.lista.model = {};
    $scope.lista.pag = $scope.pag;
    $scope.lista.Pesquisar = function () {

        $scope.lista.pag.filter = $scope.lista.model;
        $http.post("/Umbraco/Surface/SolicitacaoAdiantamentoSurface/Pesquisar", $scope.lista.pag).then(function (response) {
            $scope.lista.pag = response.data;
            $scope.lista.data = response.data.rows;
            $timeout(function () { $('[data-toggle="tooltip"]').tooltip() }, 100);
            //$("#grid-selection").parent().parent().animateCss('fadeInDown');
        }, function (error) {
            ShowMessage($scope, error.statusText, "danger");
        });
    };
    $scope.ShowImprimir = function () { return true; };
    $scope.ShowExcluir  = function () { return true; };


    $scope.ModalExcluir = function (item) {

        bootbox.confirm({
        message: "Deseja realmente excluir a Solicitação de Adiantamento <strong>" + item.motivo + "</strong> ?",
            buttons: {
                confirm: {
                    label: 'Sim',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'Não',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result) {
                    $http.post("/Umbraco/Surface/SolicitacaoAdiantamentoSurface/Excluir", { Id: item.Id }).then(function (response) {
                        $scope.lista.Pesquisar();
                    });
                }
            }
        });


    };

});

/* Controller Caixinha */
app.controller('sescoop.controllers.sistemas.caixinha', function ($scope, $http, $timeout) {

    $scope.excluir = function (id) {
        $("#form-caixinha-excluir input[name='Id']").val(id);
        $("#modal-excluir").modal("show");
    }

    $scope.novo = function () {
        $("#modal-novo").modal("show");
    };

    $scope.usuarios = function () {
        $http.post("/Umbraco/Api/Pessoa/EmailsRamais").then(function (response) {
            var data = response.data;
            $("select[name='Superior']").empty();
            for (var i = 0; i < data.length; i++) {
                $("select[name='Superior']").append("<option value='" + data[i].Id + "'>" + data[i].nome + "</option>");
            }
	    });
    };

    $('.money').mask("#.##0,00", { reverse: true });
    $scope.usuarios();

});

/* Controller Prestacao de Contas */
app.controller('sescoop.controllers.sistemas.prestacao_contas', function ($scope, $http, $timeout) {

   

    $scope.prestacao = {};
    $scope.prestacao.listaItens = function (Id) {//PrestacaoDeContasSurfaceController
        $http.post("/Umbraco/Surface/PrestacaoDeContasSurface/PesquisarItem", { "prestacaoId": Id }).then(function (response) {
            var data = response.data;
        });
    };

    $scope.prestacao_items = [];
    $scope.prestacaoId = 0;
    $scope.itens = function (Id) {
        $scope.prestacaoId = Id;
        $("#modal-prestacao-item").modal("show");

        $http.post("/Umbraco/Surface/PrestacaoDeContasSurface/PesquisarItem", { "prestacaoId": Id }).then(function (response) {
            $scope.prestacao_items = response.data;
        });
    };
    
    $scope.AdicionarItem = function () {
        var val = $("#form-prestacao-item").validate();
        if (val.checkForm()) {
            $http.post("/Umbraco/Surface/PrestacaoDeContasSurface/SalvarItem", {
                "Id": 0,
                "PrestacaoId": $scope.prestacaoId,
                "Descricao": $("#form-prestacao-item input[name='Descricao']").val(),
                "Recibo": $("#form-prestacao-item input[name='Recibo']").val(),
                "Valor": $("#form-prestacao-item input[name='Valor']").val()
            }).then(function (response) {
                $scope.itens($scope.prestacaoId);
                $("#form-prestacao-item input").val('');
            });
        }
    };

    $scope.ExcluirItem = function (Id) {
        $http.post("/Umbraco/Surface/PrestacaoDeContasSurface/ExcluirItem", { "Id": Id }).then(function (response) {
            $scope.itens($scope.prestacaoId);
        });
    };

    $scope.excluir = function (Id) {
        $("#modal-prestacao-excluir input[name='Id']").val(Id);
        $('#modal-prestacao-excluir').modal("show");
    };

    $scope.alterar = function(item) {

        $('#form-prestacao input[name="Id"]').val(item.Id);

        $scope.adiantamentosUpdate();
        $('select[name="AdiantamentoViagemId"]').append("<option value='" + item.AdiantamentoViagemId + "' selected>" + item.AdiantamentoViagemId + "</option>");
        $('select[name="AdiantamentoViagemId"]').val(item.AdiantamentoViagemId);

        $('input[name="localidade"]').val(item.localidade);
        $('input[name="Motivo"]').val(item.Motivo);
        $('input[name="periodoViagemDe"]').val(("" + item.periodoViagemDe).substring(0, 10));
        $('input[name="periodoViagemAte"]').val(("" + item.periodoViagemAte).substring(0, 10));
        $('select[name="situacaoFuncionario"]').val(item.situacaoFuncionario);

        $('select[name="tipoPgto"]').val(item.tipoPgto);
        $('input[name="banco"]').val(item.banco);
        $('input[name="agencia"]').val(item.agencia);
        $('input[name="contaCorrente"]').val(item.contaCorrente);

        $('select[name="CentroCustoEmpresa"]').val(item.CentroCustoEmpresa);
        $('select[name="CentroCusto"]').val(item.CentroCusto);

        $('#modal-prestacao').modal('show');

    };

    $scope.novo = function ()
    {
        $('#modal-prestacao').modal('show');
    };

    //$scope.SalvarItemPorAdiantamento = function () {
    //    var data = { "id": $scope.adiantamento, "prestacaoId": $scope.prestacaoId };
    //    $http.post("/Umbraco/Surface/PrestacaoDeContasSurface/SalvarItemPorAdiantamento", data).then(function (response) {
    //        $scope.itens($scope.prestacaoId);
    //    }, function (error) {
    //        console.log(error.statusText);
    //    });
    //};
    $scope.adiantamentos = [];
    $http.get("/Umbraco/Surface/SolicitacaoAdiantamentoSurface/PesquisarPorUsuario", {}).then(function (response) {
        $scope.adiantamentos = response.data;
        $scope.adiantamentosUpdate();
    });

    $scope.adiantamentosUpdate = function ( selecionado ) {
        $('select[name="AdiantamentoViagemId"]').empty();
        $('select[name="AdiantamentoViagemId"]').append("<option value=''> SEM ADIANTAMENTO </option>");
        for (var i = 0; i < $scope.adiantamentos.length; i++) {
            $('select[name="AdiantamentoViagemId"]').append("<option value='" + $scope.adiantamentos[i].Id + "' " + ($scope.adiantamentos[i].Id == selecionado ? "selected":"") + " >" + $scope.adiantamentos[i].Id + " - " + $scope.adiantamentos[i].Motivo + "</option>");
        }
    };

    $scope.soma = function (itens) {

        if (itens == undefined) return 0;

        var retorno = 0;
        for (var i = 0; i < itens.length; i++) {
            retorno += parseFloat(itens[i].Valor);
        }
        return retorno;
    };

    $scope.totalAdiantamento = function (v) {
        if (v == undefined) return 0;
        return (v.ValorTotalKm + v.ValorTotalDiaria + v.ValorTotalRefeicao + v.outrosValor);
    };

    $scope.somadespesas = function ( value ) {
        return value < 0 ? 0 : value;
    };

    $scope.moneyvalue = function (value) {
        return 0;
    };

    var oldvalue = 0;
    $scope.valorEntrar = function (item) {
        oldvalue = item;
    };

    $scope.valorSair = function (item, Id) {
        console.log(item);
        if (oldvalue != item) {
            $http.post("/Umbraco/Surface/PrestacaoDeContasSurface/mudarValor", { "itemId": Id, "valor": item }).then(function (response) {

            });
        }
    };

    $scope.AdiantamentoViagemIdChange = function (item) {
        var id = $('select[name="AdiantamentoViagemId"]').val();
        for (var i = 0; i < $scope.adiantamentos.length; i++) {
            if ($scope.adiantamentos[i].Id == id) {
                $('input[name="localidade"]').val($scope.adiantamentos[i].Localidade);
                $('input[name="motivo"]').val($scope.adiantamentos[i].Motivo);
                $('input[name="periodoViagemDe"]').val(("" + $scope.adiantamentos[i].PeriodoViagemDe).substring(0,10));
                $('input[name="periodoViagemAte"]').val(("" + $scope.adiantamentos[i].PeriodoViagemAte).substring(0, 10));
                $('select[name="situacaoFuncionario"]').val($scope.adiantamentos[i].situacaoFuncionario);

                $('select[name="tipoPgto"]').val($scope.adiantamentos[i].TipoPgto);
                $('input[name="banco"]').val($scope.adiantamentos[i].Banco);
                $('input[name="agencia"]').val($scope.adiantamentos[i].Agencia);
                $('input[name="contaCorrente"]').val($scope.adiantamentos[i].ContaCorrente);

                $('select[name="CentroCustoEmpresa"]').val($scope.adiantamentos[i].CentroCustoEmpresa);
                $('select[name="CentroCusto"]').val($scope.adiantamentos[i].CentroCusto);
            }
        }
    };

    $scope.AlterarAdiantamento = function () {
        window.open(
          "/sistemas/solicitacao-adiantamentos/Adiantamento?id=" + $scope.adiantamento,
          '_blank' // <- This is what makes it open in a new window.
        );
    };

});