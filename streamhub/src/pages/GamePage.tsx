import { useParams } from 'react-router-dom'
export default function GamePage(){ const { slug } = useParams(); return <p>Игра: {slug}</p> }
