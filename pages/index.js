import Link from 'next/link'
import mqtt from 'mqtt'
import {useEffect, useRef, useState} from 'react'

export default function Home() {
    const topic = 'python'
    const [connectStatus, setConnectStatus] = useState('Connecting...')
    const url = 'wss://broker.emqx.io:8084/mqtt'
    const options = {}
    const client = useRef(null)
    useEffect(() => {
        client.current = mqtt.connect(url, options)
        client.current.on('connect', () => {
            setConnectStatus('Connected')
        })
        client.current.on('error', (err) => {
            setConnectStatus('Error')
            console.log(err)
        })
        client.current.on('reconnect', () => {
            setConnectStatus('Reconnecting')
        })
        client.current.on('close', () => {
            setConnectStatus('Closed')
        })
        client.current.on('offline', () => {
            setConnectStatus('Offline')
        })
    }, [])

    return (
        <div className="container">
            <h1 className="text-center m-2">Remote control</h1>
            <div className="All-contain d-flex">
                <div className="Samsung-415 block">
                    <div className="Remote-btn">
                        <p>Room 415 (Samsung)</p>
                        <button className="btn btn-danger m-2" onClick={() => {
                            client.current.publish(topic, 'toggle')
                            console.log("toggle Samsung 415")
                        }}>Power
                        </button>
                        <button className="btn btn-primary m-2" onClick={() => {
                            client.current.publish(topic, 'vol_up')
                            console.log("volumeUp Samsung 415")
                        }
                        }>Volume Up
                        </button>
                        <button className="btn btn-success m-2" onClick={() => {
                            client.current.publish(topic, 'vol_down')
                            console.log("volumeDown Samsung 415")
                        }
                        }>volume Down
                        </button>
                        <button className="btn btn-dark m-2" onClick={() => {
                            client.current.publish(topic, 'mute')
                            console.log("mute Samsung 415")
                        }
                        }>Mute
                        </button>
                    </div>
                </div>
                <div className="Samsung-415">
                    <div className="Remote-btn">
                        <p>Room 412 (LG)</p>
                        <button className="btn btn-danger m-2">Power</button>
                        <button className="btn btn-primary m-2">Volume Up</button>
                        <button className="btn btn-success m-2">volume Down</button>
                        <button className="btn btn-dark m-2">Mute</button>
                    </div>
                </div>
                <div className="Samsung-415">
                    <div className="Remote-btn">
                        <p>Up right...</p>
                        <button className="btn btn-danger m-2">Power</button>
                        <button className="btn btn-primary m-2">Volume Up</button>
                        <button className="btn btn-success m-2">volume Down</button>
                        <button className="btn btn-dark m-2">Mute</button>
                    </div>
                </div>
                {/*    show mqtt connection status*/}
            </div>
            <h3 className="text-center">MQTT connection Status : {connectStatus}</h3>
            <footer>
                <p className="text-center">©Copyright <Link href="/">Group5</Link></p>
            </footer>
        </div>
    )
}
