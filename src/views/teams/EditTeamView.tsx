import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TeamInfo } from "../../api/teams/TeamRequest";
import { teamServcie } from "../../api/teams/teams.api";
import CreateTeamPage from "./CreateTeam";

const EditTeamView = () => {

    const [team, setTeam] = useState<TeamInfo | undefined>();
    const { id } = useParams<string>();

    useEffect(() => {
        if (id && !isNaN(Number(id))) {
            teamServcie.getTeamInfo(Number(id))
                .then(response => {
                    if (response.data) {
                        setTeam(response.data.data);
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
            {team &&
                <CreateTeamPage teamInfo={team} />
            }
        </div>
    );
}

export default EditTeamView;