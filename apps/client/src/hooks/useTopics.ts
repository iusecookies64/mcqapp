import { useRecoilState } from "recoil";
import { topicsAtom } from "../atoms/topicsAtom";
import { useEffect, useState } from "react";
import api, { apiConfig, errorHandler } from "../services/api";
import { CreateTopicResponse, GetTopicsResponse } from "@mcqapp/types";
import { AxiosError } from "axios";
import {
  CreateTopicBody,
  DeleteTopicBody,
  UpdateTopicBody,
} from "@mcqapp/validations";

export const useTopics = () => {
  const [topics, setTopics] = useRecoilState(topicsAtom);
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [error, setError] = useState(false);

  const handleError = (err: AxiosError) => {
    setIsLoadingAction(false);
    setIsLoadingTopics(false);
    setError(true);
    setTimeout(() => setError(false), 5000);
    errorHandler(err);
  };

  const createTopic = (data: CreateTopicBody, onSuccess?: () => void) => {
    setIsLoadingAction(true);
    api[apiConfig.createTopic.type](apiConfig.createTopic.endpoint, data)
      .then((response) => {
        const { data } = response.data as CreateTopicResponse;
        setTopics((topics) => {
          if (topics) return [data, ...topics];
          else return [data];
        });
        setIsLoadingAction(false);
        if (onSuccess) onSuccess();
      })
      .catch(handleError);
  };

  const deleteTopic = (data: DeleteTopicBody, onSuccess?: () => void) => {
    setIsLoadingAction(true);
    api[apiConfig.deleteTopic.type](apiConfig.deleteTopic.endpoint, data)
      .then(() => {
        setTopics((topics) => {
          if (!topics) return topics;
          return topics.filter((t) => t.topic_id !== data.topic_id);
        });
        setIsLoadingAction(false);
        if (onSuccess) onSuccess();
      })
      .catch(handleError);
  };

  const updateTopic = (data: UpdateTopicBody, onSuccess?: () => void) => {
    setIsLoadingAction(true);
    api[apiConfig.upadteTopic.type](apiConfig.upadteTopic.endpoint, data)
      .then(() => {
        setTopics((topics) => {
          if (!topics) return topics;
          return topics.map((topic) => {
            if (topic.topic_id === data.topic_id) {
              return { ...topic, title: data.new_title };
            } else {
              return topic;
            }
          });
        });
        setIsLoadingAction(false);
        if (onSuccess) onSuccess();
      })
      .catch(handleError);
  };

  useEffect(() => {
    if (!topics) {
      api[apiConfig.getTopics.type](apiConfig.getTopics.endpoint)
        .then((response) => {
          const { data } = response.data as GetTopicsResponse;
          setTopics(data);
          setIsLoadingTopics(false);
        })
        .catch(handleError);
    } else {
      setIsLoadingTopics(false);
    }
  }, []);

  return {
    topics,
    isLoadingAction,
    isLoadingTopics,
    error,
    createTopic,
    deleteTopic,
    updateTopic,
  };
};
