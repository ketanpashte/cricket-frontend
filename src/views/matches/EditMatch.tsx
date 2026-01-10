import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import CreateMatchPage from "./matchForm";
import { MatchResponse } from "../../api/match/matchResponse";
import { MatchService } from "../../api/match/matches.api";

const EditMatchView = () => {
    const [match, setMatch] = useState<MatchResponse | undefined>();
    const { id } = useParams<string>();
    const matchService = useRef<MatchService>(new MatchService()).current

    useEffect(() => {
        if (id && !isNaN(Number(id))) {
            matchService.getMatchInfoInfo(Number(id))
                .then(response => {
                    if (response) {
                        setMatch(response);
                    } else {
                        console.error("match not found");
                    }
                })
                .catch(error => {
                    console.error("Error fetching match info:", error);
                });
        }
    }, [id]);
    return (
        <div>
            {match &&
                <CreateMatchPage matchInfo={match} />
            }
        </div>
    );
}

export default EditMatchView;