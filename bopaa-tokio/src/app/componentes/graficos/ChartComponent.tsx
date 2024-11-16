import React, { useEffect } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

interface CotizacionData {
  id: string;
  fecha: string;
  hora: string;
  cotizacion: string;
  codEmpresa: string;
}

interface LineChartProps {
  data: CotizacionData[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  useEffect(() => {
    // Crear raíz del gráfico
    const root = am5.Root.new("chartdiv");

    // Aplicar tema
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        focusable: true,
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true
      })
    );

    // Crear ejes
    const xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: "minute", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 60 })
      })
    );

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    );

    // Crear serie de línea
    const series = chart.series.push(
      am5xy.LineSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, { labelText: "{valueY}" })
      })
    );

    // Formatear datos
    const formattedData = data.map(item => ({
      date: new Date(`${item.fecha}T${item.hora}`).getTime(),
      value: parseFloat(item.cotizacion)
    }));

    series.data.setAll(formattedData);

    // Añadir cursor
    const cursor = chart.set("cursor", am5xy.XYCursor.new(root, { behavior: "zoomX" }));
    cursor.lineY.set("visible", false);

    // Animación de carga
    series.appear(1000, 100);
    chart.appear(1000, 100);

    // Limpiar raíz en desmontaje
    return () => root.dispose();

  }, [data]);

  return <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>;
};

export default LineChart;
