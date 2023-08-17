import { useState, useEffect, useContext, useRef, Fragment } from "react";
import { GraphDataContext } from "@/context/graph-data-context";

import { PiGraphDuotone } from "react-icons/pi";
import { AiOutlinePlusCircle } from "react-icons/ai";

const QueryForm = () => {
  const {
    setTopicQID: setTopicQID,
    nodes: nodes,
    fetchGraphData: fetchGraphData,
  } = useContext(GraphDataContext);

  let i = 0;
  let initialSearchOptions = null;
  if (i === 0) {
    initialSearchOptions = nodes.map((node) => {
      const item = node.data;
      return {
        qid: item.qid,
        value: item.label,
        aliases: item.aliases,
        label: item.label,
        description: item.description,
        url: item.url,
        uri: item.uri,
        pageId: item.pageId,
        respository: item.respository,
      };
    });
    i++;
  }
  const [searchOptions, setSearchOptions] = useState(initialSearchOptions);
  const [searchOptionItems, setSearchOptionItems] =
    useState(initialSearchOptions);
  const [prevSearchOptions, setPrevSearchOptions] =
    useState(initialSearchOptions);

  const [searchBoxIsFocused, setSearchBoxIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const searchBoxDropdownRef = useRef(null);

  if (prevSearchOptions !== searchOptions) {
    setPrevSearchOptions(searchOptions);
  }

  async function getSearchOptions(inputValue) {
    const searchOptionsEndpoint =
      `https://www.wikidata.org/w/api.php?` +
      `action=wbsearchentities` +
      `&format=json` +
      `&origin=*` +
      `&language=en` +
      `&limit=10` +
      `&search=` +
      inputValue;

    let response = null;
    let json = null;
    try {
      response = await fetch(searchOptionsEndpoint);
    } catch (error) {
      console.log(error);
    }
    if (response.status !== 200) {
      console.log(response.status);
      return;
    } else {
      json = await response.json();
    }
    let fetchedOptions = null;
    try {
      fetchedOptions = json.search;
    } catch (error) {
      console.log(error);
    }
    if (!fetchedOptions) return;
    setSearchOptions(fetchedOptions);

    // creating search option items list from fetched items
    if (fetchedOptions !== undefined && fetchedOptions !== prevSearchOptions) {
      const items = fetchedOptions.map((topic) => {
        return {
          qid: topic.id, // qid is returned as id
          value: topic.match.text,
          aliases: topic.aliases,
          label: topic.label,
          description: topic.description,
          url: topic.url,
          uri: topic.concepturi,
          pageId: topic.pageid,
          respository: topic.repository,
        };
      });
      setSearchOptionItems(items);
    }
  }

  function handleSearchInput(event) {
    let input = event.target.value;
    setInputValue(input);
    const timerId = setTimeout(() => {
      getSearchOptions(input);
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }

  function handleDropdownClick(event) {
    event.preventDefault();
    console.log("dropdown click");

    const li = event.target.closest("li");
    const { qid, value } = li.dataset;

    setTopicQID(qid);
    setInputValue(value);
    setSearchBoxIsFocused(false);
    fetchGraphData(qid);
  }

  function handleCreateNewGraphClick(event) {
    event.preventDefault();
    event.stopPropagation(); 

    console.log("create new graph");
    const li = event.target.closest("li");
    const { qid, value } = li.dataset;

    setTopicQID(qid);
    setInputValue(value);
    setSearchBoxIsFocused(false);

    const createNewGraph = true;
    const addNodeToGraph = false;
    fetchGraphData(qid, createNewGraph, addNodeToGraph);
  }

  function handleAddToGraphClick(event) {
    event.preventDefault();
    event.stopPropagation(); 

    // console.log("add to graph");
    const li = event.target.closest("li");
    const { qid, value } = li.dataset;

    setTopicQID(qid);
    setInputValue(value);
    setSearchBoxIsFocused(false);

    const addNodeToGraph = true;
    const createNewGraph = false;
    fetchGraphData(qid, createNewGraph, addNodeToGraph);
  }

  return (
    <div className="flex w-full justify-center z-20 bg-inherit">
      <form className="relative w-full justify-center z-20 bg-inherit">
        <input
          type="text"
          placeholder="Search..."
          value={inputValue}
          onChange={handleSearchInput}
          onFocus={() => setSearchBoxIsFocused(true)}
          onBlur={() => setSearchBoxIsFocused(false)}
          className="z-20 w-full px-4 py-2 text-gray-200 placeholder:text-gray-200 bg-inherit border border-indigo-500 border-2 rounded-md focus:outline-none focus:border-indigo-300"
        />
        <div
          ref={searchBoxDropdownRef}
          className={
            searchBoxIsFocused
              ? "z-20 w-full absolute top-12 overflow-y-auto h-96 rounded-md border border-indigo-300"
              : "hidden"
          }
        >
          {searchOptionItems !== undefined && searchBoxIsFocused && (
            <ul
              className={
                searchOptionItems !== undefined
                  ? "z-20 w-full divide-indigo-300 divide-y divide-solid"
                  : "hidden"
              }
            >
              {searchOptionItems.map((item, index) => {
                return (
                  <li
                    key={index}
                    className="flex flex-row px-4 py-2 justify-between cursor-pointer bg-indigo-500 hover:bg-indigo-600"
                    data-qid={item.qid}
                    data-value={item.value}
                    data-aliases={item.aliases}
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
                      <div
                        className="flex flex-row gap-2 justify-center text-base text-gray-300 fill-gray-300 hover:text-white hover:fill-white cursor-pointer"
                        onMouseDown={handleAddToGraphClick}
                      >
                        <span className="flex">Add</span>
                        <AiOutlinePlusCircle
                          id="add-to-graph"
                          key={"add-to-graph"}
                          value="add-to-graph"
                          title="Add to current graph"
                          className="w-6 h-6"
                        />
                      </div>
                      <div
                        className="flex flex-row gap-2 text-center justify-center text-base text-gray-300 fill-gray-300 hover:text-white hover:fill-white cursor-pointer"
                        onMouseDown={handleCreateNewGraphClick}
                      >
                        New
                        <PiGraphDuotone
                          id="create-new-graph"
                          key={"create-new-graph"}
                          value="create-new-graph"
                          title="Create new graph"
                          className="w-6 h-6"
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </form>
    </div>
  );
};

export default QueryForm;
