import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import playerApi from "../../api/players/playerApi";
import { PlayerInfoFull } from "../../api/players/res/players";
import CreatePlayerPage from "./CreatePlayerView";

const EditPlayerView = () => {

    const [player, setPlayer] = useState<PlayerInfoFull | undefined>();
    const { id } = useParams<string>();

    useEffect(() => {
        if (id && !isNaN(Number(id))) {
            playerApi.getPlayerInfoFull(Number(id))
                .then(response => {
                    if (response.data) {
                        setPlayer(response.data.data);
                    } else {
                        console.error("Player not found");
                    }
                })
                .catch(error => {
                    console.error("Error fetching player info:", error);
                });
        }
    }, [id]);
    return (
        <div>
            {player &&
                <CreatePlayerPage playerInfo={player} />
            }
        </div>
    );
}

export default EditPlayerView;