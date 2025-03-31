<template>
  <div class="svg-container">
    <svg version="1.0" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" viewBox="0 124.488 1580.0249687890137 741" style="max-height: 500px" width="1580.0249687890137" height="741">
      <g class="spots">
        <g class="spot1">
          <rect @mouseover="showTooltip(1)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 1)" :class="{ occupied: guests.some(guest => guest.Plass === 1) }" fill="#394856" stroke="#394856" x="1482.97202" y="654.50685" width="40" height="60" id="svg_5" rx="5" transform="rotate(-20 1502.97 684.506)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="1495.84993" y="692.26786" id="svg_63" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(-20 1502.45 683.731)">1</text>
        </g>
        <g class="spot2">
          <rect @mouseover="showTooltip(2, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 2)" :class="{ occupied: guests.some(guest => guest.Plass === 2) }" fill="#394856" stroke="#394856" x="1433.91939" y="670.59707" width="40" height="60" id="svg_3" rx="5" transform="rotate(-15 1453.92 700.596)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="1447.55758" y="710.57548" id="svg_62" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(-15 1454.16 702.038)">2</text>
        </g>
        <g class="spot3">
          <rect @mouseover="showTooltip(3, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 3)" :class="{ occupied: guests.some(guest => guest.Plass === 3) }" fill="#394856" stroke="#394856" x="1380.49082" y="682.50184" width="40" height="60" id="svg_4" rx="5" transform="rotate(-15 1400.49 712.501)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="1394.87502" y="720.56034" id="svg_61" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(-15 1401.48 712.023)">3</text>
        </g>
        <g class="spot4">
          <rect @mouseover="showTooltip(4, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 4)" :class="{ occupied: guests.some(guest => guest.Plass === 4) }" fill="#394856" stroke="#394856" x="1330.16931" y="703.75206" width="40" height="60" id="svg_12" rx="5" transform="rotate(-24 1350.17 733.751)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="1343.39796" y="743.21674" id="svg_60" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(-24 1350 734.617)">4</text>
        </g>
        <g class="spot5">
          <rect @mouseover="showTooltip(5, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 5)" :class="{ occupied: guests.some(guest => guest.Plass === 5) }" fill="#394856" stroke="#394856" x="1282.47853" y="729.96113" width="40" height="60" id="svg_13" rx="5" transform="rotate(-28 1302.48 759.961)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="1295.76187" y="767.51561" id="svg_77" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(-28 1302.37 758.979)">5</text>
        </g>
        <g class="spot6">
          <rect @mouseover="showTooltip(6, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 6)" :class="{ occupied: guests.some(guest => guest.Plass === 6) }" fill="#394856" stroke="#394856" x="1233.12776" y="753.84124" width="40" height="60" id="svg_9" rx="5" transform="rotate(-20 1253.13 783.841)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="1246.92203" y="793.69019" id="svg_58" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(-20 1253.52 785.091)">6</text>
        </g>
        <g class="spot7">
          <rect @mouseover="showTooltip(7, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 7)" :class="{ occupied: guests.some(guest => guest.Plass === 7) }" fill="#394856" stroke="#394856" x="1180.84205" y="767.68049" width="40" height="60" id="svg_7" rx="5" transform="rotate(-12 1200.84 797.68)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="1194.23947" y="806.71169" id="svg_57" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(-12 1200.84 798.112)">7</text>
        </g>
        <g class="spot8">
          <rect @mouseover="showTooltip(8, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 8)" :class="{ occupied: guests.some(guest => guest.Plass === 8) }" fill="#394856" stroke="#394856" x="1126.58604" y="775.49002" width="40" height="60" id="svg_14" rx="5" transform="rotate(-7 1146.59 805.489)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="1139.6057" y="815.3026" id="svg_56" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(-7 1146.21 806.703)">8</text>
        </g>
        <g class="spot9">
          <rect @mouseover="showTooltip(9, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 9)" :class="{ occupied: guests.some(guest => guest.Plass === 9) }" fill="#394856" stroke="#394856" x="1071.63368" y="779.54947" width="40" height="60" id="svg_6" rx="5" transform="rotate(-4 1091.63 809.549)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="1086.58448" y="819.09625" id="svg_55" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(-4 1093.18 810.559)">9</text>
        </g>
        <g class="spot10">
          <rect @mouseover="showTooltip(10, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 10)" :class="{ occupied: guests.some(guest => guest.Plass === 10) }" fill="#394856" stroke="#394856" x="1014.01463" y="778.12089" width="40" height="60" id="svg_10" rx="5"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="1021.21908" y="817.14504" id="svg_54" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal">10</text>
        </g>
        <g class="spot11">
          <rect @mouseover="showTooltip(11, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 11)" :class="{ occupied: guests.some(guest => guest.Plass === 11) }" fill="#394856" stroke="#394856" x="963.25272" y="768.4066" width="40" height="60" id="svg_11" rx="5" transform="rotate(7 983.253 798.406)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="970.59361" y="806.75012" id="svg_53" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(7 983.794 798.231)">11</text>
        </g>
        <g class="spot12">
          <rect @mouseover="showTooltip(12, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 12)" :class="{ occupied: guests.some(guest => guest.Plass === 12) }" fill="#394856" stroke="#394856" x="912.58604" y="753.359" width="40" height="60" id="svg_19" rx="5" transform="rotate(14 932.586 783.358)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="919.7376" y="793.44134" id="svg_52" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(14 932.939 784.885)">12</text>
        </g>
        <g class="spot13">
          <rect @mouseover="showTooltip(13, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 13)" :class="{ occupied: guests.some(guest => guest.Plass === 13) }" fill="#394856" stroke="#394856" x="863.15747" y="736.02566" width="40" height="60" id="svg_21" rx="5" transform="rotate(20 883.157 766.025)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="870.84917" y="775.66372" id="svg_51" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(20 884.05 767.108)">13</text>
        </g>
        <g class="spot14">
          <rect @mouseover="showTooltip(14, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 14)" :class="{ occupied: guests.some(guest => guest.Plass === 14) }" fill="#394856" stroke="#394856" x="812.30037" y="715.93041" width="40" height="60" id="svg_8" rx="5" transform="rotate(20 832.3 745.93)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="820.183" y="755.21948" id="svg_50" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(20 833.384 746.663)">14</text>
        </g>
        <g class="spot15">
          <rect @mouseover="showTooltip(15, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 15)" :class="{ occupied: guests.some(guest => guest.Plass === 15) }" fill="#394856" stroke="#394856" x="758.49084" y="691.54946" width="40" height="60" id="svg_23" rx="5" transform="rotate(24 778.491 721.549)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="764.18354" y="731.66415" id="svg_49" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(24 777.385 723.108)">15</text>
        </g>
        <g class="spot16">
          <rect @mouseover="showTooltip(16, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 16)" :class="{ occupied: guests.some(guest => guest.Plass === 16) }" fill="#394856" stroke="#394856" x="709.06223" y="666.21612" width="40" height="60" id="svg_15" rx="5" transform="rotate(27 729.062 696.215)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="715.73956" y="705.44218" id="svg_48" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(27 728.94 696.775)">16</text>
        </g>
        <g class="spot17">
          <rect @mouseover="showTooltip(17, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 17)" :class="{ occupied: guests.some(guest => guest.Plass === 17) }" fill="#394856" stroke="#394856" x="661.06222" y="639.35898" width="40" height="60" id="svg_16" rx="5" transform="rotate(28 681.062 669.358)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="667.73987" y="679.44235" id="svg_47" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(28 680.941 670.886)">17</text>
        </g>
        <g class="spot18">
          <rect @mouseover="showTooltip(18, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 18)" :class="{ occupied: guests.some(guest => guest.Plass === 18) }" fill="#394856" stroke="#394856" x="607.34795" y="613.73993" width="40" height="60" id="svg_20" rx="5" transform="rotate(25 627.348 643.739)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="613.57276" y="653.88665" id="svg_46" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(25 626.774 645.386)">18</text>
        </g>
        <g class="spot19">
          <rect @mouseover="showTooltip(19, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 19)" :class="{ occupied: guests.some(guest => guest.Plass === 19) }" fill="#394856" stroke="#394856" x="552.30034" y="595.54947" width="40" height="60" id="svg_18" rx="5" transform="rotate(15 572.3 625.549)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="559.29542" y="634.9979" id="svg_45" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(15 572.496 626.497)">19</text>
        </g>
        <g class="spot20">
          <rect @mouseover="showTooltip(20, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 20)" :class="{ occupied: guests.some(guest => guest.Plass === 20) }" fill="#394856" stroke="#394856" x="1455.82916" y="575.93542" width="40" height="60" id="svg_27" rx="5" transform="rotate(-20 1475.83 605.935)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="1463.13388" y="614.49008" id="svg_65" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(-20 1476.34 606.002)">20</text>
        </g>
        <g class="spot21">
          <rect @mouseover="showTooltip(21, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 21)" :class="{ occupied: guests.some(guest => guest.Plass === 21) }" fill="#394856" stroke="#394856" x="1406.77653" y="589.1685" width="40" height="60" id="svg_28" rx="5" transform="rotate(-15 1426.78 619.168)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="1415.45881" y="627.85943" id="svg_64" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(-15 1428.66 619.371)">21</text>
        </g>
        <g class="spot22">
          <rect @mouseover="showTooltip(22, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 22)" :class="{ occupied: guests.some(guest => guest.Plass === 22) }" fill="#394856" stroke="#394856" x="1353.34796" y="605.35898" width="40" height="60" id="svg_29" rx="5" transform="rotate(-15 1373.35 635.358)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="1361.54168" y="644.01714" id="svg_66" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(-15 1374.74 635.529)">22</text>
        </g>
        <g class="spot23">
          <rect @mouseover="showTooltip(23, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 23)" :class="{ occupied: guests.some(guest => guest.Plass === 23) }" fill="#394856" stroke="#394856" x="1294.30034" y="621.35898" width="40" height="60" id="svg_30" rx="5" transform="rotate(-20 1314.3 651.358)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="1302.24531" y="660.96071" id="svg_67" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(-20 1315.45 652.472)">23</text>
        </g>
        <g class="spot24">
          <rect @mouseover="showTooltip(24, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 24)" :class="{ occupied: guests.some(guest => guest.Plass === 24) }" fill="#394856" stroke="#394856" x="1243.53844" y="643.73994" width="40" height="60" id="svg_31" rx="5" transform="rotate(-25 1263.54 673.739)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="1251.56572" y="683.04636" id="svg_68" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(-25 1264.77 674.558)">24</text>
        </g>
        <g class="spot25">
          <rect @mouseover="showTooltip(25, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 25)" :class="{ occupied: guests.some(guest => guest.Plass === 25) }" fill="#394856" stroke="#394856" x="1193.61002" y="664.94224" width="40" height="60" id="svg_32" rx="5" transform="rotate(-21 1213.61 694.942)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="1201.32955" y="703.56421" id="svg_76" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(-21 1214.53 694.965)">25</text>
        </g>
        <g class="spot26">
          <rect @mouseover="showTooltip(26, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 26)" :class="{ occupied: guests.some(guest => guest.Plass === 26) }" fill="#394856" stroke="#394856" x="1140.67541" y="678.03345" width="40" height="60" id="svg_33" rx="5" transform="rotate(-13 1160.67 708.033)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="1147.52755" y="717.71333" id="svg_75" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(-13 1160.73 709.137)">26</text>
        </g>
        <g class="spot27">
          <rect @mouseover="showTooltip(27, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 27)" :class="{ occupied: guests.some(guest => guest.Plass === 27) }" fill="#394856" stroke="#394856" x="1088.01462" y="682.78756" width="40" height="60" id="svg_34" rx="5" transform="rotate(-5 1108.01 712.787)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="1095.21676" y="722.58574" id="svg_74" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(-5 1108.42 714.062)">27</text>
        </g>
        <g class="spot28">
          <rect @mouseover="showTooltip(28, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 28)" :class="{ occupied: guests.some(guest => guest.Plass === 28) }" fill="#394856" stroke="#394856" x="1035.91939" y="682.40661" width="40" height="60" id="svg_35" rx="5"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="1042.86243" y="721.96074" id="svg_73" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal">28</text>
        </g>
        <g class="spot29">
          <rect @mouseover="showTooltip(29, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 29)" :class="{ occupied: guests.some(guest => guest.Plass === 29) }" fill="#394856" stroke="#394856" x="983.25272" y="672.69231" width="40" height="60" id="svg_36" rx="5" transform="rotate(7 1003.25 702.692)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="989.9673" y="712.66827" id="svg_72" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(7 1003.17 704.145)">29</text>
        </g>
        <g class="spot30">
          <rect @mouseover="showTooltip(30, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 30)" :class="{ occupied: guests.some(guest => guest.Plass === 30) }" fill="#394856" stroke="#394856" x="931.15747" y="660.50185" width="40" height="60" id="svg_37" rx="5" transform="rotate(14 951.157 690.501)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="938.45985" y="699.59051" id="svg_71" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(14 951.658 691.067)">30</text>
        </g>
        <g class="spot31">
          <rect @mouseover="showTooltip(31, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 31)" :class="{ occupied: guests.some(guest => guest.Plass === 31) }" fill="#394856" stroke="#394856" x="880.30033" y="643.16851" width="40" height="60" id="svg_38" rx="5" transform="rotate(20 900.3 673.168)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="887.56197" y="683.08964" id="svg_70" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(20 900.76 674.566)">31</text>
        </g>
        <g class="spot32">
          <rect @mouseover="showTooltip(32, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 32)" :class="{ occupied: guests.some(guest => guest.Plass === 32) }" fill="#394856" stroke="#394856" x="1202.26455" y="560.57342" width="40" height="60" id="svg_39" rx="5" transform="rotate(-20 1222.26 590.573)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="1209.99387" y="599.59266" id="svg_69" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(-20 1223.2 590.993)">32</text>
        </g>
        <g class="spot33">
          <rect @mouseover="showTooltip(33, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 33)" :class="{ occupied: guests.some(guest => guest.Plass === 33) }" fill="#394856" stroke="#394856" x="1156.77653" y="576.21612" width="40" height="60" id="svg_40" rx="5" transform="rotate(-18 1176.78 606.215)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="1164.55345" y="614.67397" id="svg_81" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(-18 1177.75 606.074)">33</text>
        </g>
        <g class="spot34">
          <rect @mouseover="showTooltip(34, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 34)" :class="{ occupied: guests.some(guest => guest.Plass === 34) }" fill="#394856" stroke="#394856" x="1105.12776" y="587.83517" width="40" height="60" id="svg_41" rx="5" transform="rotate(-10 1125.13 617.835)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="1112.68194" y="627.3199" id="svg_79" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(-10 1125.88 618.72)">34</text>
        </g>
        <g class="spot35">
          <rect @mouseover="showTooltip(35, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 35)" :class="{ occupied: guests.some(guest => guest.Plass === 35) }" fill="#394856" stroke="#394856" x="1052.30033" y="592.78756" width="40" height="60" id="svg_42" rx="5" transform="rotate(-5 1072.3 622.787)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="1059.4959" y="631.30159" id="svg_78" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(-5 1072.69 622.778)">35</text>
        </g>
        <g class="spot36">
          <rect @mouseover="showTooltip(36, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 36)" :class="{ occupied: guests.some(guest => guest.Plass === 36) }" fill="#394856" stroke="#394856" x="994.68129" y="586.97802" width="40" height="60" id="svg_43" rx="5" transform="rotate(7 1014.68 616.977)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="1001.61922" y="626.69491" id="svg_80" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(7 1014.82 618.171)">36</text>
        </g>
        <g class="spot37">
          <rect @mouseover="showTooltip(37, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 37)" :class="{ occupied: guests.some(guest => guest.Plass === 37) }" fill="#394856" stroke="#394856" x="938.97132" y="573.35899" width="40" height="60" id="svg_44" rx="5" transform="rotate(14 958.971 603.358)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="945.63506" y="612.94887" id="svg_59" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(14 958.833 604.425)">37</text>
        </g>
        <g class="spot38">
          <rect @mouseover="showTooltip(38, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 38)" :class="{ occupied: guests.some(guest => guest.Plass === 38) }" fill="#394856" stroke="#394856" x="223.93837" y="346.13093" width="40" height="60" id="svg_17" rx="5" transform="rotate(40 243.938 376.131)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="232.03402" y="384.56578" id="svg_82" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(40 245.235 375.905)">38</text>
        </g>
        <g class="spot39">
          <rect @mouseover="showTooltip(39, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 39)" :class="{ occupied: guests.some(guest => guest.Plass === 39) }" fill="#394856" stroke="#394856" x="187.76297" y="316.79759" width="40" height="60" id="svg_24" rx="5" transform="rotate(40 207.763 346.798)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="195.80392" y="354.5101" id="svg_85" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(40 209.005 345.849)">39</text>
        </g>
        <g class="spot40">
          <rect @mouseover="showTooltip(40, $event)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 40)" :class="{ occupied: guests.some(guest => guest.Plass === 40) }" fill="#394856" stroke="#394856" x="91.62031" y="253.86191" width="35" height="60" id="svg_22" rx="5" transform="rotate(50 109.12 283.862)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="97.19655" y="291.22496" id="svg_84" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(50 110.398 282.564)">40</text>
        </g>
        <g class="spot41">
          <rect @mouseover="showTooltip(41)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 41)" :class="{ occupied: guests.some(guest => guest.Plass === 41) }" fill="#394856" stroke="#394856" x="57.25771" y="222.49349" width="40" height="60" id="svg_26" rx="5" transform="rotate(55 77.2577 252.494)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="64.26971" y="260.60765" id="svg_83" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(55 77.4686 252.22)">41</text>
        </g>
        <g class="spot42">
          <rect @mouseover="showTooltip(42)" @mouseleave="hideTooltip" @click="$emit('rectangleClicked', 42)" :class="{ occupied: guests.some(guest => guest.Plass === 42) }" fill="#394856" stroke="#394856" x="38.1817" y="179.28881" width="40" height="60" id="svg_25" rx="5" transform="rotate(60 58.1817 209.289)"/>
          <text fill="#eeeeee" stroke="#eeeeee" x="45.70422" y="216.89775" id="svg_86" stroke-width="0" font-size="22" font-family="'Noto Sans Mono'" text-anchor="start" xml:space="preserve" font-weight="normal" transform="rotate(60 58.9031 208.51)">42</text>
        </g>
        <path fill="#444444" stroke-width="0" d="m-259.09594,-66.2158l0.56913,0l0.17587,-0.54067l0.17587,0.54067l0.56913,0l-0.46044,0.33415l0.17588,0.54067l-0.46044,-0.33416l-0.46044,0.33416l0.17588,-0.54067l-0.46044,-0.33415z" id="svg_96" style="vector-effect: non-scaling-stroke;" stroke="#394856"/>
        <g transform="translate(0 2160) scale(0.1 -0.1)" fill="#394856">
          <path d="m426.58041,20212c-111,-94 -146,-151 -256,-415c-98,-235 -83,-430 54,-700c112,-220 261,-431 402,-570c203,-198 347,-236 650,-172c224,48 331,36 384,-43c34,-50 27,-129 -23,-240c-103,-233 -99,-220 -99,-305c-1,-106 29,-172 116,-258c129,-127 241,-172 428,-172c118,0 133,3 273,44c139,40 155,43 240,39c75,-4 106,-10 169,-37c152,-64 329,-188 578,-407c182,-159 281,-238 495,-395c192,-140 380,-294 442,-361c63,-69 76,-101 71,-173c-3,-54 -11,-74 -61,-159c-80,-133 -97,-173 -97,-232c0,-111 70,-172 385,-334c110,-56 253,-131 318,-167c224,-123 325,-160 637,-233c250,-58 331,-84 495,-155c255,-111 949,-452 1217,-597c367,-198 817,-399 1524,-681c621,-248 704,-278 929,-333c344,-84 562,-107 1025,-108c390,0 588,13 1000,65c516,64 840,140 1138,265c129,54 227,107 397,215c410,260 630,370 895,449c55,16 223,54 373,85c407,83 593,138 768,226c236,117 362,267 404,478c25,123 17,492 -13,604c-37,135 -93,229 -207,343c-113,114 -210,182 -406,283c-234,122 -368,173 -709,271c-232,67 -278,84 -393,142c-110,55 -171,95 -306,199c-111,87 -131,99 -131,79c0,-14 145,-127 260,-204c169,-113 270,-155 584,-246c329,-94 520,-170 741,-292c158,-88 248,-152 340,-243c122,-120 183,-233 216,-400c21,-105 19,-469 -3,-556c-36,-141 -109,-251 -224,-337c-182,-137 -416,-219 -899,-318c-295,-59 -415,-90 -533,-133c-222,-83 -385,-168 -709,-372c-337,-212 -548,-305 -888,-392c-233,-60 -622,-120 -1070,-164c-263,-26 -978,-26 -1185,0c-382,48 -679,129 -1090,299c-107,44 -296,120 -420,168c-512,199 -1003,420 -1375,619c-251,135 -465,242 -853,428c-507,242 -583,271 -892,338c-283,62 -362,94 -769,307c-425,222 -448,236 -500,295c-71,80 -65,129 34,303c93,164 102,207 60,299c-42,89 -199,228 -555,488c-107,79 -256,195 -330,259c-382,329 -482,403 -654,485c-174,82 -251,86 -465,24c-174,-51 -260,-62 -357,-47c-187,29 -385,177 -424,315c-23,84 -10,169 44,287c71,155 88,208 88,272c0,109 -65,167 -197,175c-52,4 -111,-3 -230,-27c-213,-42 -316,-40 -420,8c-83,39 -154,91 -231,170c-194,198 -426,582 -475,790c-17,69 -20,109 -16,197c4,100 7,119 45,210c103,255 158,345 267,440c60,53 77,75 57,75c-4,0 -40,-27 -78,-60z"/>
        </g>
      </g>
    </svg>

    <div v-if="tooltipVisible" :style="tooltipStyle" class="guest-tooltip">
      <div class="guest-name">{{ tooltipData.Navn }}</div>
      <div class="guest-nationality">
        <img
          v-if="countryFlag(tooltipData.Nasjonalitet)"
          :src="countryFlag(tooltipData.Nasjonalitet)"
          :alt="tooltipData.Nasjonalitet"
          width="20"
          height="15"
          style="margin-right: 8px"
        />
        {{ tooltipData.Nasjonalitet }}</div>
    </div>

  </div>
</template>

<script>
import { countries } from '@/tools/countries';

export default {
  name: 'MapComponent',
  props: {
    guests: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tooltipVisible: false,
      tooltipData: {},
      tooltipStyle: {
        position: 'absolute',
        left: '200px',
        top: '250px'
      }
    };
  },
  methods: {
    getGuest(spot) {
      return this.guests.find(guest => guest.Plass === spot) || null;
    },
    showTooltip(spot) {
      const guest = this.getGuest(spot);
      if (guest) {
        this.tooltipData = guest;
        this.tooltipVisible = true;
      } else {
        this.tooltipVisible = false;
      }
    },
    hideTooltip() {
      this.tooltipVisible = false;
    },
    countryFlag(nasjonalitet) {
  if (!nasjonalitet) return '';
  const entry = Object.entries(countries).find(
    ([, data]) => data.name.toLowerCase() === nasjonalitet.toLowerCase()
  );
  return entry ? entry[1].flag : '';
}
  }
};
</script>

<style scoped>
.svg-container {
  position: relative;
  width: 90%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
svg {
  width: 100%;
  height: auto;
}
rect {
  cursor: pointer;
}

text {
  pointer-events: none;
}

.occupied {
  fill: red;
  stroke: red;
}
rect:hover {
  fill: black;
  stroke: black;
}

.guest-tooltip {
  position: absolute;
  background: #fff;
  border: 1px solid #eee;
  padding: 10px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  pointer-events: none;
  z-index: 10;
}
.guest-name {
  font-weight: bold;
  margin-bottom: 5px;
}
.guest-nationality {
  font-size: 0.9em;
  color: #555;
}
</style>