var chart;
anychart.onDocumentLoad(function() {
  var data4 = [
    [0, 0],
    [1, 0.0785],
    [2, 0.1568],
    [3, 0.2347],
    [4, 0.3119],
    [5, 0.3882],
    [6, 0.4635],
    [7, 0.5376],
    [8, 0.6101],
    [9, 0.681],
    [10, 0.75],
    [11, 0.817],
    [12, 0.8817],
    [13, 0.944],
    [14, 1.0037],
    [15, 1.0607],
    [16, 1.1147],
    [17, 1.1657],
    [18, 1.2135],
    [19, 1.258],
    [20, 1.299],
    [21, 1.3365],
    [22, 1.3703],
    [23, 1.4004],
    [24, 1.4266],
    [25, 1.4489],
    [26, 1.4672],
    [27, 1.4815],
    [28, 1.4918],
    [29, 1.4979],
    [30, 1.5],
    [31, 1.4979],
    [32, 1.4918],
    [33, 1.4815],
    [34, 1.4672],
    [35, 1.4489],
    [36, 1.4266],
    [37, 1.4004],
    [38, 1.3703],
    [39, 1.3365],
    [40, 1.299],
    [41, 1.258],
    [42, 1.2135],
    [43, 1.1657],
    [44, 1.1147],
    [45, 1.0607],
    [46, 1.0037],
    [47, 0.944],
    [48, 0.8817],
    [49, 0.817],
    [50, 0.75],
    [51, 0.681],
    [52, 0.6101],
    [53, 0.5376],
    [54, 0.4635],
    [55, 0.3882],
    [56, 0.3119],
    [57, 0.2347],
    [58, 0.1568],
    [59, 0.0785],
    [60, 0],
    [61, 0.0785],
    [62, 0.1568],
    [63, 0.2347],
    [64, 0.3119],
    [65, 0.3882],
    [66, 0.4635],
    [67, 0.5376],
    [68, 0.6101],
    [69, 0.681],
    [70, 0.75],
    [71, 0.817],
    [72, 0.8817],
    [73, 0.944],
    [74, 1.0037],
    [75, 1.0607],
    [76, 1.1147],
    [77, 1.1657],
    [78, 1.2135],
    [79, 1.258],
    [80, 1.299],
    [81, 1.3365],
    [82, 1.3703],
    [83, 1.4004],
    [84, 1.4266],
    [85, 1.4489],
    [86, 1.4672],
    [87, 1.4815],
    [88, 1.4918],
    [89, 1.4979],
    [90, 1.5],
    [91, 1.4979],
    [92, 1.4918],
    [93, 1.4815],
    [94, 1.4672],
    [95, 1.4489],
    [96, 1.4266],
    [97, 1.4004],
    [98, 1.3703],
    [99, 1.3365],
    [100, 1.299],
    [101, 1.258],
    [102, 1.2135],
    [103, 1.1657],
    [104, 1.1147],
    [105, 1.0607],
    [106, 1.0037],
    [107, 0.944],
    [108, 0.8817],
    [109, 0.817],
    [110, 0.75],
    [111, 0.681],
    [112, 0.6101],
    [113, 0.5376],
    [114, 0.4635],
    [115, 0.3882],
    [116, 0.3119],
    [117, 0.2347],
    [118, 0.1568],
    [119, 0.0785],
    [120, 0],
    [121, 0.0785],
    [122, 0.1568],
    [123, 0.2347],
    [124, 0.3119],
    [125, 0.3882],
    [126, 0.4635],
    [127, 0.5376],
    [128, 0.6101],
    [129, 0.681],
    [130, 0.75],
    [131, 0.817],
    [132, 0.8817],
    [133, 0.944],
    [134, 1.0037],
    [135, 1.0607],
    [136, 1.1147],
    [137, 1.1657],
    [138, 1.2135],
    [139, 1.258],
    [140, 1.299],
    [141, 1.3365],
    [142, 1.3703],
    [143, 1.4004],
    [144, 1.4266],
    [145, 1.4489],
    [146, 1.4672],
    [147, 1.4815],
    [148, 1.4918],
    [149, 1.4979],
    [150, 1.5],
    [151, 1.4979],
    [152, 1.4918],
    [153, 1.4815],
    [154, 1.4672],
    [155, 1.4489],
    [156, 1.4266],
    [157, 1.4004],
    [158, 1.3703],
    [159, 1.3365],
    [160, 1.299],
    [161, 1.258],
    [162, 1.2135],
    [163, 1.1657],
    [164, 1.1147],
    [165, 1.0607],
    [166, 1.0037],
    [167, 0.944],
    [168, 0.8817],
    [169, 0.817],
    [170, 0.75],
    [171, 0.681],
    [172, 0.6101],
    [173, 0.5376],
    [174, 0.4635],
    [175, 0.3882],
    [176, 0.3119],
    [177, 0.2347],
    [178, 0.1568],
    [179, 0.0785],
    [180, 0],
    [181, 0.0785],
    [182, 0.1568],
    [183, 0.2347],
    [184, 0.3119],
    [185, 0.3882],
    [186, 0.4635],
    [187, 0.5376],
    [188, 0.6101],
    [189, 0.681],
    [190, 0.75],
    [191, 0.817],
    [192, 0.8817],
    [193, 0.944],
    [194, 1.0037],
    [195, 1.0607],
    [196, 1.1147],
    [197, 1.1657],
    [198, 1.2135],
    [199, 1.258],
    [200, 1.299],
    [201, 1.3365],
    [202, 1.3703],
    [203, 1.4004],
    [204, 1.4266],
    [205, 1.4489],
    [206, 1.4672],
    [207, 1.4815],
    [208, 1.4918],
    [209, 1.4979],
    [210, 1.5],
    [211, 1.4979],
    [212, 1.4918],
    [213, 1.4815],
    [214, 1.4672],
    [215, 1.4489],
    [216, 1.4266],
    [217, 1.4004],
    [218, 1.3703],
    [219, 1.3365],
    [220, 1.299],
    [221, 1.258],
    [222, 1.2135],
    [223, 1.1657],
    [224, 1.1147],
    [225, 1.0607],
    [226, 1.0037],
    [227, 0.944],
    [228, 0.8817],
    [229, 0.817],
    [230, 0.75],
    [231, 0.681],
    [232, 0.6101],
    [233, 0.5376],
    [234, 0.4635],
    [235, 0.3882],
    [236, 0.3119],
    [237, 0.2347],
    [238, 0.1568],
    [239, 0.0785],
    [240, 0],
    [241, 0.0785],
    [242, 0.1568],
    [243, 0.2347],
    [244, 0.3119],
    [245, 0.3882],
    [246, 0.4635],
    [247, 0.5376],
    [248, 0.6101],
    [249, 0.681],
    [250, 0.75],
    [251, 0.817],
    [252, 0.8817],
    [253, 0.944],
    [254, 1.0037],
    [255, 1.0607],
    [256, 1.1147],
    [257, 1.1657],
    [258, 1.2135],
    [259, 1.258],
    [260, 1.299],
    [261, 1.3365],
    [262, 1.3703],
    [263, 1.4004],
    [264, 1.4266],
    [265, 1.4489],
    [266, 1.4672],
    [267, 1.4815],
    [268, 1.4918],
    [269, 1.4979],
    [270, 1.5],
    [271, 1.4979],
    [272, 1.4918],
    [273, 1.4815],
    [274, 1.4672],
    [275, 1.4489],
    [276, 1.4266],
    [277, 1.4004],
    [278, 1.3703],
    [279, 1.3365],
    [280, 1.299],
    [281, 1.258],
    [282, 1.2135],
    [283, 1.1657],
    [284, 1.1147],
    [285, 1.0607],
    [286, 1.0037],
    [287, 0.944],
    [288, 0.8817],
    [289, 0.817],
    [290, 0.75],
    [291, 0.681],
    [292, 0.6101],
    [293, 0.5376],
    [294, 0.4635],
    [295, 0.3882],
    [296, 0.3119],
    [297, 0.2347],
    [298, 0.1568],
    [299, 0.0785],
    [300, 0],
    [301, 0.0785],
    [302, 0.1568],
    [303, 0.2347],
    [304, 0.3119],
    [305, 0.3882],
    [306, 0.4635],
    [307, 0.5376],
    [308, 0.6101],
    [309, 0.681],
    [310, 0.75],
    [311, 0.817],
    [312, 0.8817],
    [313, 0.944],
    [314, 1.0037],
    [315, 1.0607],
    [316, 1.1147],
    [317, 1.1657],
    [318, 1.2135],
    [319, 1.258],
    [320, 1.299],
    [321, 1.3365],
    [322, 1.3703],
    [323, 1.4004],
    [324, 1.4266],
    [325, 1.4489],
    [326, 1.4672],
    [327, 1.4815],
    [328, 1.4918],
    [329, 1.4979],
    [330, 1.5],
    [331, 1.4979],
    [332, 1.4918],
    [333, 1.4815],
    [334, 1.4672],
    [335, 1.4489],
    [336, 1.4266],
    [337, 1.4004],
    [338, 1.3703],
    [339, 1.3365],
    [340, 1.299],
    [341, 1.258],
    [342, 1.2135],
    [343, 1.1657],
    [344, 1.1147],
    [345, 1.0607],
    [346, 1.0037],
    [347, 0.944],
    [348, 0.8817],
    [349, 0.817],
    [350, 0.75],
    [351, 0.681],
    [352, 0.6101],
    [353, 0.5376],
    [354, 0.4635],
    [355, 0.3882],
    [356, 0.3119],
    [357, 0.2347],
    [358, 0.1568],
    [359, 0.0785],
    [360, 0]
  ];

  chart = anychart.polar()
      .container('container')
      .startAngle(0);

  chart.yScale().stackMode(anychart.enums.ScaleStackMode.VALUE);
  chart.yScale().ticks().interval(.2);
  chart.xScale().maximum(360);
  chart.xScale().ticks().interval(15);
  chart.palette(['blue .5', 'yellow .5', 'green .5', 'red .5']);
  chart.yAxis().minorTicks().enabled(false);
  chart.xAxis().labels().textFormatter(function() {return this['value'] + '°'});
  chart.title(null);
  chart.background().enabled(true);

  chart.grid(1).oddFill(null).evenFill(null);
  chart.grid(0).oddFill('white');

  var series1 = chart.line(data4);
  series1.markers().enabled(false);
  series1.stroke('4 blue .5');

  chart.draw();
});