function init () {
    /**
     * Создание мультимаршрута.
     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRoute.xml
     */
    var multiRoute = new ymaps.multiRouter.MultiRoute({
        referencePoints: ["Москва, ул.Шербаковская, 38"],
        params: {
            //Тип маршрутизации - пешеходная маршрутизация.
            routingMode: 'pedestrian'
        }
    }, {
        // Тип промежуточных точек, которые могут быть добавлены при редактировании.
        editorMidPointsType: "via",
        // В режиме добавления новых путевых точек запрещаем ставить точки поверх объектов карты.
        editorDrawOver: false
    });

    var buttonEditor = new ymaps.control.Button({
        data: { content: "Режим редактирования" }
    });

    buttonEditor.events.add("select", function () {
        /**
         * Включение режима редактирования.
         * В качестве опций может быть передан объект с полями:
         * addWayPoints - разрешает добавление новых путевых точек при клике на карту. Значение по умолчанию: false.
         * dragWayPoints - разрешает перетаскивание уже существующих путевых точек. Значение по умолчанию: true.
         * removeWayPoints - разрешает удаление путевых точек при двойном клике по ним. Значение по умолчанию: false.
         * dragViaPoints - разрешает перетаскивание уже существующих транзитных точек. Значение по умолчанию: true.
         * removeViaPoints - разрешает удаление транзитных точек при двойном клике по ним. Значение по умолчанию: true.
         * addMidPoints - разрешает добавление промежуточных транзитных или путевых точек посредством перетаскивания маркера, появляющегося при наведении курсора мыши на активный маршрут. Тип добавляемых точек задается опцией midPointsType. Значение по умолчанию: true
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRoute.xml#editor
         */
        multiRoute.editor.start({
            addWayPoints: true,
            removeWayPoints: true
        });
    });

    buttonEditor.events.add("deselect", function () {
        // Выключение режима редактирования.
        multiRoute.editor.stop();
    });

    // Создаем карту с добавленной на нее кнопкой.
    var myMap = new ymaps.Map('map', {
        center: [55.78123982928414,37.73150623544307],
        zoom: 13,
        controls: [buttonEditor],
        behaviors: ["drag"],
    }, {
        buttonMaxWidth: 300
    });

    // Добавляем мультимаршрут на карту.
    ZoomLayout = ymaps.templateLayoutFactory.createClass("<div>" +
                "<div id='zoom-in' class='btn-plus'><i class='icon-plus'></i></div><br>" +
                "<div id='zoom-out' class='btn-minus'><i class='icon-minus'></i></div>" +
                "</div>", {

                /**
                 * Redefining methods of the layout, in order to perform
                 * additional steps when building and clearing the layout.
                 */
                build: function () {
                    // Calling the "build" parent method.
                    ZoomLayout.superclass.build.call(this);

                    /**
                     * Binding handler functions to the context and storing references
                     * to them in order to unsubscribe from the event later.
                     */
                    this.zoomInCallback = ymaps.util.bind(this.zoomIn, this);
                    this.zoomOutCallback = ymaps.util.bind(this.zoomOut, this);

                    // Beginning to listen for clicks on the layout buttons.
                    $('#zoom-in').bind('click', this.zoomInCallback);
                    $('#zoom-out').bind('click', this.zoomOutCallback);
                },

                clear: function () {
                    // Removing click handlers.
                    $('#zoom-in').unbind('click', this.zoomInCallback);
                    $('#zoom-out').unbind('click', this.zoomOutCallback);

                    // Calling the "clear" parent method.
                    ZoomLayout.superclass.clear.call(this);
                },

                zoomIn: function () {
                    var map = this.getData().control.getMap();
                    map.setZoom(map.getZoom() + 1, {checkZoomRange: true});
                },

                zoomOut: function () {
                    var map = this.getData().control.getMap();
                    map.setZoom(map.getZoom() - 1, {checkZoomRange: true});
                }
            }),
            zoomControl = new ymaps.control.ZoomControl({options: {layout: ZoomLayout}});
    myMap.geoObjects.add(multiRoute);
    myMap.controls.add(zoomControl);
}

ymaps.ready(init);
