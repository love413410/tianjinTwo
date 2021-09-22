// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.32/esri/copyright.txt for details.
//>>built
define("esri/dijit/analysis/nls/th/GenerateMultidimensionalAnomaly",{toolDefine:"\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e04\u0e27\u0e32\u0e21\u0e1c\u0e34\u0e14\u0e1b\u0e01\u0e15\u0e34\u0e2b\u0e25\u0e32\u0e22\u0e21\u0e34\u0e15\u0e34",outputLayerName:"${layername}_anomaly",variablesLabel:"\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e15\u0e31\u0e27\u0e41\u0e1b\u0e23\u0e17\u0e35\u0e48\u0e08\u0e30\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e04\u0e27\u0e32\u0e21\u0e1c\u0e34\u0e14\u0e1b\u0e01\u0e15\u0e34",variablesListLabel:"\u0e15\u0e31\u0e27\u0e41\u0e1b\u0e23 [Dimension Info] (\u0e04\u0e33\u0e2d\u0e18\u0e34\u0e1a\u0e32\u0e22)",
methodLabel:"\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e27\u0e34\u0e18\u0e35\u0e01\u0e32\u0e23\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e04\u0e27\u0e32\u0e21\u0e1c\u0e34\u0e14\u0e1b\u0e01\u0e15\u0e34",calculationIntervalLabel:"\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e0a\u0e48\u0e27\u0e07\u0e40\u0e27\u0e25\u0e32\u0e0a\u0e31\u0e48\u0e27\u0e04\u0e23\u0e32\u0e27\u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e04\u0e33\u0e19\u0e27\u0e13\u0e04\u0e48\u0e32\u0e40\u0e09\u0e25\u0e35\u0e48\u0e22",differenceFromMean:"\u0e2a\u0e48\u0e27\u0e19\u0e15\u0e48\u0e32\u0e07\u0e08\u0e32\u0e01\u0e04\u0e48\u0e32\u0e40\u0e09\u0e25\u0e35\u0e48\u0e22",
percentDifferenceFromMean:"\u0e2a\u0e48\u0e27\u0e19\u0e15\u0e48\u0e32\u0e07\u0e40\u0e1b\u0e2d\u0e23\u0e4c\u0e40\u0e0b\u0e47\u0e19\u0e15\u0e4c\u0e08\u0e32\u0e01\u0e04\u0e48\u0e32\u0e40\u0e09\u0e25\u0e35\u0e48\u0e22",percentOfMean:"\u0e40\u0e1b\u0e2d\u0e23\u0e4c\u0e40\u0e0b\u0e47\u0e19\u0e15\u0e4c\u0e02\u0e2d\u0e07\u0e04\u0e48\u0e32\u0e40\u0e09\u0e25\u0e35\u0e48\u0e22",zScore:"\u0e04\u0e30\u0e41\u0e19\u0e19 Z",differenceFromMedian:"\u0e2a\u0e48\u0e27\u0e19\u0e15\u0e48\u0e32\u0e07\u0e08\u0e32\u0e01\u0e21\u0e31\u0e18\u0e22\u0e10\u0e32\u0e19",
percentDifferenceFromMedian:"\u0e2a\u0e48\u0e27\u0e19\u0e15\u0e48\u0e32\u0e07\u0e40\u0e1b\u0e2d\u0e23\u0e4c\u0e40\u0e0b\u0e47\u0e19\u0e15\u0e4c\u0e08\u0e32\u0e01\u0e21\u0e31\u0e18\u0e22\u0e10\u0e32\u0e19",percentOfMedian:"\u0e40\u0e1b\u0e2d\u0e23\u0e4c\u0e40\u0e0b\u0e47\u0e19\u0e15\u0e4c\u0e02\u0e2d\u0e07\u0e21\u0e31\u0e18\u0e22\u0e10\u0e32\u0e19",all:"\u0e17\u0e31\u0e49\u0e07\u0e2b\u0e21\u0e14",yearly:"\u0e23\u0e32\u0e22\u0e1b\u0e35",recurringMonthly:"\u0e40\u0e01\u0e34\u0e14\u0e0b\u0e49\u0e33\u0e23\u0e32\u0e22\u0e40\u0e14\u0e37\u0e2d\u0e19",
recurringWeekly:"\u0e40\u0e01\u0e34\u0e14\u0e0b\u0e49\u0e33\u0e23\u0e32\u0e22\u0e2a\u0e31\u0e1b\u0e14\u0e32\u0e2b\u0e4c",recurringDaily:"\u0e40\u0e01\u0e34\u0e14\u0e0b\u0e49\u0e33\u0e23\u0e32\u0e22\u0e27\u0e31\u0e19",hourly:"\u0e23\u0e32\u0e22\u0e0a\u0e31\u0e48\u0e27\u0e42\u0e21\u0e07",ignoreNodataLabel:"\u0e40\u0e1e\u0e34\u0e01\u0e40\u0e09\u0e22\u0e04\u0e48\u0e32\u0e17\u0e35\u0e48\u0e2b\u0e32\u0e22\u0e44\u0e1b\u0e43\u0e19\u0e01\u0e32\u0e23\u0e04\u0e33\u0e19\u0e27\u0e13",ignore:"\u0e40\u0e1e\u0e34\u0e01\u0e40\u0e09\u0e22",
analysisLayerLabel:"\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e0a\u0e31\u0e49\u0e19\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e20\u0e32\u0e1e\u0e2b\u0e25\u0e32\u0e22\u0e21\u0e34\u0e15\u0e34\u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e04\u0e27\u0e32\u0e21\u0e1c\u0e34\u0e14\u0e1b\u0e01\u0e15\u0e34",itemDescription:"\u0e01\u0e32\u0e23\u0e27\u0e34\u0e40\u0e04\u0e23\u0e32\u0e30\u0e2b\u0e4c\u0e2d\u0e34\u0e21\u0e40\u0e21\u0e08\u0e40\u0e0b\u0e2d\u0e23\u0e4c\u0e27\u0e34\u0e2a\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e08\u0e32\u0e01\u0e04\u0e27\u0e32\u0e21\u0e1c\u0e34\u0e14\u0e1b\u0e01\u0e15\u0e34\u0e2b\u0e25\u0e32\u0e22\u0e21\u0e34\u0e15\u0e34\u0e41\u0e25\u0e49\u0e27",
itemTags:"\u0e1c\u0e25\u0e01\u0e32\u0e23\u0e27\u0e34\u0e40\u0e04\u0e23\u0e32\u0e30\u0e2b\u0e4c\u0e41\u0e23\u0e2a\u0e40\u0e15\u0e2d\u0e23\u0e4c, \u0e2a\u0e23\u0e49\u0e32\u0e07\u0e04\u0e27\u0e32\u0e21\u0e1c\u0e34\u0e14\u0e1b\u0e01\u0e15\u0e34\u0e2b\u0e25\u0e32\u0e22\u0e21\u0e34\u0e15\u0e34 ${layername}",itemSnippet:"\u0e01\u0e32\u0e23\u0e27\u0e34\u0e40\u0e04\u0e23\u0e32\u0e30\u0e2b\u0e4c\u0e2d\u0e34\u0e21\u0e40\u0e21\u0e08\u0e40\u0e0b\u0e2d\u0e23\u0e4c\u0e27\u0e34\u0e2a\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e08\u0e32\u0e01\u0e04\u0e27\u0e32\u0e21\u0e1c\u0e34\u0e14\u0e1b\u0e01\u0e15\u0e34\u0e2b\u0e25\u0e32\u0e22\u0e21\u0e34\u0e15\u0e34\u0e41\u0e25\u0e49\u0e27"});