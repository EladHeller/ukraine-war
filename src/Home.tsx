import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Brush,
  ResponsiveContainer,
} from 'recharts';
import warData from './data.json';
import { HistoryRecordWithAreas } from './types.d';

import './Home.scss';

const distinctData = warData
  .map((war: HistoryRecordWithAreas) => ({
    name: new Date(war.createdAt).toLocaleDateString('en-GB'),
    משוחרר: war.liberated.toFixed(2),
    כבוש: war.occupied.toFixed(2),
    'לא ידוע': war.unspecified.toFixed(2),
  }))
  .reverse()
  .filter((v, i, a) => a.findIndex((t) => (t.name === v.name)) === i)
  .reverse();

interface ChartLabelProps {
  viewBox: {
    x: number;
  };
  stroke: string;
  text: string;
  offset: number;
  top: number;
  left?: number;
}

function ChartLabel(props: ChartLabelProps) {
  const {
    viewBox: { x }, text, offset, top, left = 0,
  } = props;
  return (
    <text x={x + left} y={top} dx={-20} offset={offset} fill="green" fontSize={12} textAnchor="middle">
      {text}
    </text>
  );
}

export default function App() {
  return <div className="App" dir='rtl'>
    <ResponsiveContainer width="100%" height={800}>
      <LineChart
        data={distinctData}
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
        <ReferenceLine x="05/04/2022" stroke="green" label={(props) => <ChartLabel {...props} top={240} left={20} text="סיום נסיגת רוסיה מהצפון"/>} />
        <ReferenceLine x="06/09/2022" stroke="green" label={(props) => <ChartLabel {...props} top={120} text="מתקפת חרקוב"/>} />
        <ReferenceLine x="01/10/2022" stroke="green" label={(props) => <ChartLabel {...props} top={190} text="שחרור צפון חרסון"/>} />
        <ReferenceLine x="09/11/2022" stroke="green" label={(props) => <ChartLabel {...props} top={220} text="נסיגת רוסיה מחרסון"/>} />
        <ReferenceLine x="06/06/2023" stroke="green" label={(props) => <ChartLabel {...props} top={240} left={-20} text="פיצוץ סכר נובה קחובקה"/>} />
        <Line type="monotone" dataKey="לא ידוע" stroke="#00c02b" />
        <Line type="monotone" dataKey="משוחרר" stroke="blue" />
        <Line type="monotone" dataKey="כבוש" stroke="red" />
        <Brush dataKey="name" height={30} stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>

    <div>
      <span>מבוסס על נתונים מ-</span><a target='_blank' rel="noreferrer noopener" href='https://deepstatemap.live/en'>https://deepstatemap.live/en</a>
    </div>
  </div>;
}
