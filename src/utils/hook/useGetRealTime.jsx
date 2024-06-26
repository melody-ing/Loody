import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";

export const useGetRealTime = (path) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);
  useEffect(() => {
    const userRef = ref(database, path);
    const unsubscribe = onValue(
      userRef,
      (snapshot) => {
        try {
          const data = snapshot.val();
          setData(data);
        } catch (error) {
          setIsError(error.message);
          setData(null);
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setIsError(error.message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [path]);
  return { data, isError, isLoading };
};

export const useGetRealTimeNavigate = (path, navigation) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);
  useEffect(() => {
    const userRef = ref(database, path);
    const unsubscribe = onValue(
      userRef,
      (snapshot) => {
        try {
          const data = snapshot.val();
          if (data === null) navigation;
          setData(data);
        } catch (error) {
          setIsError(error.message);
          setData(null);
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setIsError(error.message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [path]);
  return { data, isError, isLoading };
};
