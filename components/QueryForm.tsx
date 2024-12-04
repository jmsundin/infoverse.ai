import React, { useState, useEffect, useContext, useRef, Fragment, useCallback } from "react";
import { AppContext } from "@/context/AppContext";
import { getSearchOptions, fetchGraphData } from "@/lib/utils";
import { SearchOptions } from "@/lib/types";
import createGraphWithSuggestedTopics from "@/data/suggestedTopics";

import { useRouter } from "next/router";
import * as ga from "../lib/ga";

import { PiGraphDuotone } from "react-icons/pi";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { IoClose } from "react-icons/io5";

import { data } from "data/suggestedTopics";

function QueryForm({ getGraphData }) {
  const router = useRouter();

  // TODO: Use most popular wikipedia articles as initial dropdown list

  const [suggestedTopics, setSuggestedTopics] = useState<any[]>([]);

  useEffect(() => {
    const topics = createGraphWithSuggestedTopics();
    if (topics) {
      setSuggestedTopics(topics.children);
    }
  }, []);

  const [searchBoxIsFocused, setSearchBoxIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchOptions, setSearchOptions] = useState<SearchOptions[] | null>(null);

  const searchBoxDropdownRef = useRef(null);

  const handleSearchInput = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    let input = event.target.value;
    setInputValue(input);
    if (!input.trim()) {
      setSearchOptions(null);
      return;
    }
    
    const timerId = setTimeout(async () => {
      const response = await getSearchOptions(input);
      if (response === null) return;
      setSearchOptions(response.search);
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, []);

  function handleInputDelete(event) {
    event.preventDefault();
    setInputValue("");
    setSearchBoxIsFocused(false);
  }

  function handleDropdownClick(event) {
    event.preventDefault();

    searchInputAnalytics();

    const li = event.target.closest("li");
    const { qid, value } = li.dataset;
    getGraphData(qid);
    setInputValue(value);
    setSearchBoxIsFocused(false);
  }

  function searchInputAnalytics() {
    ga.event({
      action: "search_input",
      params: {
        search_input: inputValue,
      },
    });
  }

  function handleSubmitSearch(event) {
    event.preventDefault();
    // console.log("searchOptions:", searchOptions);

    // TODO: best match search option

    searchOptions && searchOptions.find((option) => {
      if (option.label === inputValue) {
        fetchGraphData(option.qid);
        setSearchBoxIsFocused(false);
      }
    });

    searchInputAnalytics();
  }

  return (
    <form
      onSubmit={handleSubmitSearch}
      className="flex-1 relative justify-center z-10 bg-inherit mb-2"
    >
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="What topic would you like to explore?"
          value={inputValue}
          onChange={handleSearchInput}
          onFocus={() => setSearchBoxIsFocused(true)}
          onBlur={() => setSearchBoxIsFocused(false)}
          className="z-10 flex-1 px-4 py-2 text-gray-200 placeholder:text-gray-200 bg-inherit border border-indigo-500 border-2 rounded-md focus:outline-none focus:border-indigo-300 flex flex-auto px-3 min-w-[320px] bg-inherit pr-12"
        />
        <IoClose
          className="z-10 absolute right-3 cursor-pointer h-8 w-8 fill-gray-400 hover:fill-gray-200"
          onClick={handleInputDelete}
          onTouchStart={handleInputDelete}
        />
      </div>
      <div
        ref={searchBoxDropdownRef}
        className={
          searchBoxIsFocused
            ? "z-10 w-full absolute top-12 overflow-y-auto h-[500px] rounded-md border border-indigo-300"
            : "hidden"
        }
      >
        <ul className="z-10 w-full divide-indigo-300 divide-y divide-solid">
          { searchOptions ? (
            // Show search results if there are any
            searchOptions.map((item, index) => {
              return (
                <li
                  key={index}
                  className="flex flex-row px-4 py-2 justify-between cursor-pointer bg-indigo-500 hover:bg-indigo-600"
                  data-qid={item.qid}
                  data-value={item.display.label.value}
                  data-label={item.label}
                  data-description={item.description}
                  data-uri={item.concepturi}
                  data-url={item.url}
                  data-pageid={item.pageid}
                  onMouseDown={handleDropdownClick}
                >
                  <div className="flex flex-col text-gray-200">
                    <span className="font-bold">{item.label}</span>
                    <p className="flex flex-row">{item.description}</p>
                  </div>
                  <div className="flex flex-col justify-center gap-2 bg-inherit">
                    <div
                      className="flex flex-row gap-2 justify-center text-base text-gray-300 fill-gray-300 hover:text-white hover:fill-white cursor-pointer"
                      // onMouseDown={handleAddToGraphClick}
                    >
                      <span className="flex">Add</span>
                      <AiOutlinePlusCircle
                        id="add-to-graph"
                        key={"add-to-graph"}
                        values="add-to-graph"
                        title="Add to current graph"
                        className="w-6 h-6"
                      />
                    </div>
                    <div
                      className="flex flex-row gap-2 text-center justify-center text-base text-gray-300 fill-gray-300 hover:text-white hover:fill-white cursor-pointer"
                      // onMouseDown={handleCreateNewGraphClick}
                    >
                      New
                      <PiGraphDuotone
                        id="create-new-graph"
                        key={"create-new-graph"}
                        values="create-new-graph"
                        title="Create new graph"
                        className="w-6 h-6"
                      />
                    </div>
                  </div>
                </li>
                )})) : (
                // Show suggested topics if no search input
                suggestedTopics.map((item, index) => {
                 return (<li
                    key={index}
                    className="flex flex-row px-4 py-2 justify-between cursor-pointer bg-indigo-500 hover:bg-indigo-600"
                    data-qid={item.qid}
                    data-value={item.value}
                    data-label={item.label}
                    data-description={item.description}
                    data-uri={item.uri}
                    data-url={item.url}
                    data-pageid={item.pageId}
                    onMouseDown={handleDropdownClick}
                  >
                    <div className="flex flex-col text-gray-200">
                      <span className="font-bold">{item.label}</span>
                      <p className="flex flex-row">{item.description}</p>
                    </div>
                    <div className="flex flex-col justify-center gap-2 bg-inherit">
                      <div className="flex flex-row gap-2 justify-center text-base text-gray-300 fill-gray-300 hover:text-white hover:fill-white cursor-pointer">
                        <span className="flex">Add</span>
                        <AiOutlinePlusCircle
                          id="add-to-graph"
                          key={"add-to-graph"}
                          values="add-to-graph"
                          title="Add to current graph"
                          className="w-6 h-6"
                        />
                      </div>
                      <div className="flex flex-row gap-2 text-center justify-center text-base text-gray-300 fill-gray-300 hover:text-white hover:fill-white cursor-pointer">
                        New
                        <PiGraphDuotone
                          id="create-new-graph"
                          key={"create-new-graph"}
                          values="create-new-graph"
                          title="Create new graph"
                          className="w-6 h-6"
                        />
                      </div>
                    </div>
                  </li>)}))}
        </ul>
      </div>
    </form>
  );
};

export default QueryForm;
