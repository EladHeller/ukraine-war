import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import warData from './data.json';
import { HistoryRecordWithAreas } from './types.d';

import './Home.css';

const data = warData.map((war: HistoryRecordWithAreas) => ({
  name: new Date(war.createdAt).toLocaleDateString(),
  משוחרר: war.liberated.toFixed(2),
  כבוש: war.occupied.toFixed(2),
  'לא ידוע': war.unspecified.toFixed(2),
}));
const distinct = data.filter((v, i, a) => a.findIndex((t) => (t.name === v.name)) === i);

interface ChartLabelProps {
  viewBox: {
    x: number;
  };
  stroke: string;
  text: string;
  offset: number;
  top: number;
}

function ChartLabel(props: ChartLabelProps) {
  const {
    viewBox: { x }, text, offset, top,
  } = props;
  return (
    <text x={x} y={top} dx={-20} offset={offset} fill="green" fontSize={12} textAnchor="middle">
      {text}
    </text>
  );
}

export default function App() {
  return (
    <LineChart
      width={1500}
      height={800}
      data={distinct}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <ReferenceLine x="4/5/2022" stroke="green" label={(props) => <ChartLabel {...props} top={240} text="סיום נסיגת רוסיה מהצפון"/>} />
      <ReferenceLine x="9/6/2022" stroke="green" label={(props) => <ChartLabel {...props} top={120} text="מתקפת חרקוב"/>} />
      <ReferenceLine x="10/1/2022" stroke="green" label={(props) => <ChartLabel {...props} top={190} text="שחרור צפון חרסון"/>} />
      <ReferenceLine x="11/9/2022" stroke="green" label={(props) => <ChartLabel {...props} top={220} text="נסיגת רוסיה מחרסון"/>} />
      <ReferenceLine x="6/6/2023" stroke="green" label={(props) => <ChartLabel {...props} top={240} text="פיצוץ סכר נובה קחובקה"/>} />
      <Line type="monotone" dataKey="לא ידוע" stroke="#00c02b" />
      <Line type="monotone" dataKey="משוחרר" stroke="blue" />
      <Line type="monotone" dataKey="כבוש" stroke="red" />
    </LineChart>
  );
}
