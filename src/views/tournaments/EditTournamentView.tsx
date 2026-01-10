import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CreateTournamentPage from "./TournamentForm";
import { TournamnetInfoResponse } from "../../api/tournamnet/tournamentResponse";
import { tournamentService } from "../../api/tournamnet/tournament.api";

const EditTournamentView = () => {

    const [tournament, setTournament] = useState<TournamnetInfoResponse | undefined>();
    const { id } = useParams<string>();

    useEffect(() => {
        if (id && !isNaN(Number(id))) {
            tournamentService.getTournamentInfo(Number(id))
                .then(response => {
                    if (response.data) {
                        setTournament(response.data.data);
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
            {tournament &&
                <CreateTournamentPage tournamentInfo={tournament} />
            }
        </div>
    );
}

export default EditTournamentView;