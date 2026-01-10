import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import {
  AddScorePayload,
  MatchResult,
  StartInningPayload,
  StartBatterPayload,
  StartOverPayload,
  Innings,
  DismissalPayload,
  MatchHeader,
  OverListResponse,
} from '../../../api/ball_user/types';
import MatchApi from '../../../api/ball_user/MatchApi';

interface MatchContextType {
  matchInfo: MatchResult | null;
  currentInnings: Innings | null;
  matchHeader: MatchHeader | null;
  loading: boolean;
  error: string | null;
  refreshMatchData: () => void;
  startInning: (payload: StartInningPayload) => Promise<void>;
  startOver: (payload: StartOverPayload) => Promise<void>;
  startBatter: (payload: StartBatterPayload) => Promise<void>;
  addScore: (payload: AddScorePayload) => Promise<void>;
  addScoreWithDismissal: (payload: DismissalPayload) => Promise<void>;
  undo: () => Promise<void>; //
  canUndo?: boolean;
  overListResponse?: OverListResponse[]; // Optional, if you want to expose overs
  fetchOvers?: () => Promise<void>; // Optional, if you want to expose fetchOvers
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

interface MatchProviderProps {
  matchId: string;
  children: ReactNode;
}

export const MatchProvider: React.FC<MatchProviderProps> = ({ matchId, children }) => {
  const [matchInfo, setMatchInfo] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overListResponse, setOverListResponse] = useState<OverListResponse[]>([]);
  const [matchHeader, setMatchHeader] = useState<MatchHeader | null>(null);

  const fetchMatchHeader = useCallback(() => {
    setLoading(true);
    setError(null);
    try {
      MatchApi.getMatchHeader(matchId).then((res) => {
        setMatchHeader(res);
      });
    } catch (err) {
      console.error(err);
      setError('Failed to load match header');
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);
    try {
      MatchApi.getMatchById(matchId).then((res) => {
        setMatchInfo(res);
      });
    } catch (err) {
      console.error(err);
      setError('Failed to load match data');
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    fetchData();
    fetchMatchHeader();
    fetchData()
  }, [fetchData, fetchMatchHeader]);

  const startInning = async (payload: StartInningPayload) => {
    try {
      MatchApi.startInnings(matchId, payload);
      fetchMatchHeader();
      fetchData()
    } catch (err) {
      console.error(err);
      setError('Failed to start innings');
    }
  };

  const startOver = async (payload: StartOverPayload) => {
    try {
      await MatchApi.startOver(matchId, payload);
      fetchMatchHeader();
      fetchData()
    } catch (err) {
      console.error(err);
      setError('Failed to start over');
    }
  };

  const startBatter = async (payload: StartBatterPayload) => {
    try {
      await MatchApi.startBatter(matchId, payload);
      fetchMatchHeader();
      fetchData()
    } catch (err) {
      console.error(err);
      setError('Failed to start batter');
    }
  };

  const addScore = async (payload: AddScorePayload) => {
    try {
      await MatchApi.completeBall(matchId, payload);
      fetchMatchHeader();
      fetchData()
    } catch (err) {
      console.error(err);
      setError('Failed to add score');
    }
  };

  const addScoreWithDismissal = async (payload: DismissalPayload) => {
    try {
      await MatchApi.completeBallDismissal(matchId, payload);
      fetchMatchHeader();
      fetchData()
    } catch (err) {
      console.error(err);
      setError('Failed to add score with dismissal');
    }
  };

  const fetchOvers = useCallback(async () => {
    try {
      const overs = await MatchApi.getOvers(matchId);
      setOverListResponse(overs);
    } catch (err) {
      console.error(err);
      setError('Failed to load overs');
    }
  }, [matchId]);

  const undo = async () => {
    try {
      await MatchApi.undo(matchId);
      await fetchMatchHeader();
      fetchData()
    } catch (err) {
      console.error(err);
      setError('Failed to undo last action');
    }
  };

  const currentInnings = matchInfo?.innings?.[0] ?? null;

  return (
    <MatchContext.Provider
      value={{
        matchInfo,
        currentInnings,
        loading,
        error,
        matchHeader,
        refreshMatchData: fetchData,
        startInning,
        startOver,
        startBatter,
        addScore,
        addScoreWithDismissal,
        undo,
        canUndo: true,
        overListResponse,
        fetchOvers,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};


export const useMatch = (): MatchContextType => {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error('useMatch must be used within a MatchProvider');
  }
  return context;
};
