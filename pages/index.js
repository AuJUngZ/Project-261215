import Link from "next/link";
import mqtt from "mqtt";
import {useEffect, useRef, useState} from "react";

export default function Home() {
    const topic_LG = "LG";
    const topic_Samsung = "Samsung";
    const [connectStatus, setConnectStatus] = useState("Connecting...");
    const [connection, setConnection] = useState(false);
    const [LGStatus, setLGStatus] = useState("Disconnected");
    const [SamsungStatus, setSamsungStatus] = useState("Disconnected");
    const url = "wss://broker.emqx.io:8084/mqtt";
    const options = {};
    const client = useRef(null);

    useEffect(() => {
        if (!connection) {
            client.current = mqtt.connect(url, options);
            client.current.on("connect", () => {
                setConnectStatus("Connected");
            });
            client.current.on("error", (err) => {
                setConnectStatus("Error");
                
            });
            client.current.on("reconnect", () => {
                setConnectStatus("Reconnecting");
            });
            client.current.on("close", () => {
                setConnectStatus("Closed");
            });
            client.current.on("offline", () => {
                setConnectStatus("Offline");
            });
            //check connection of ESP32 LG
            client.current.subscribe(topic_LG);
            client.current.on("message", (topic, message) => {
                if (topic === topic_LG) {
                    updateStatusLG(message.toString());
                }
            });

            //check connection of ESP32 Samsung
            client.current.subscribe(topic_Samsung);
            client.current.on("message", (topic, message) => {
                if (topic === topic_Samsung) {
                    updateStatusLG(message.toString());
                }
            });

            return () => {
                setConnection(true);
            }
        }
    }, []);
    const updateStatusLG = (message) => {
        if (message === "connected") {
            setLGStatus("Connected");
        } else {
            setLGStatus("Disconnected");
        }
    }

    const publish = (topic, message) => {
        client.current.publish(topic, message);
    }

    return (<div className="container">
            <h1 className="text-center m-2">Remote control</h1>
            <div className="All-contain d-flex justify-content-center gap-5">
                <div className="Samsung-415 block">
                    <div className="Remote-btn">
                        <p>Room 415 (SM {SamsungStatus})</p>
                        <button
                            className="btn btn-danger m-2"
                            onClick={() => {
                                publish(topic_LG, "toggle");
                            }}
                        >
                            Power
                        </button>
                        <button
                            className="btn btn-primary m-2"
                            onClick={() => {
                                publish(topic_LG, "vol_up");
                            }}
                        >
                            Volume Up
                        </button>
                        <button
                            className="btn btn-success m-2"
                            onClick={() => {
                                publish(topic_LG, "vol_down");
                            }}
                        >
                            volume Down
                        </button>
                        <button
                            className="btn btn-dark m-2"
                            onClick={() => {
                                publish(topic_LG, "mute");
                            }}
                        >
                            Mute
                        </button>
                        <button className="btn btn-warning m-2" onClick={() => {
                            publish(topic_LG, "hdmi1");
                        }}>Switch HDMI 1
                        </button>
                        <button className="btn btn-secondary m-2" onClick={() => {
                            publish(topic_LG, "hdmi2");
                        }}>Switch to HDMI 2
                        </button>
                        <button className="btn btn-primary m-2" onClick={() => {
                            publish(topic_LG, "av");
                        }}>Switch to AV
                        </button>
                    </div>
                </div>
                <div className="Samsung-415">
                    <div className="Remote-btn">
                        <p>Room 412 (LG {LGStatus})</p>
                        <button
                            className="btn btn-danger m-2"
                            onClick={() => {
                                publish(topic_Samsung, "toggle");
                            }}
                        >
                            Power
                        </button>
                        <button
                            className="btn btn-primary m-2"
                            onClick={() => {
                                publish(topic_Samsung, "vol_up");
                            }}
                        >
                            Volume Up
                        </button>
                        <button
                            className="btn btn-success m-2"
                            onClick={() => {
                                publish(topic_Samsung, "vol_down");
                            }}
                        >
                            volume Down
                        </button>
                        <button
                            className="btn btn-dark m-2"
                            onClick={() => {
                                publish(topic_Samsung, "mute");
                            }}
                        >
                            Mute
                        </button>
                        <button className="btn btn-warning m-2" onClick={() => {
                            publish(topic_Samsung, "hdmi1");
                        }}>Switch HDMI 1
                        </button>
                        <button className="btn btn-secondary m-2" onClick={() => {
                            publish(topic_Samsung, "hdmi2");
                        }}
                        >Switch to HDMI 2
                        </button>
                        <button className="btn btn-primary m-2" onClick={() => {
                            publish(topic_Samsung, "av");
                        }}>Switch to AV
                        </button>
                    </div>
                </div>
                {/*    show mqtt connection status*/}
            </div>
            <h3 className="text-center">MQTT connection Status : {connectStatus}</h3>
            <footer>
                <p className="text-center">
                    ©Copyright <Link href="/">Group5</Link>
                </p>
            </footer>
        </div>);
}
