import { useState, useEffect, useContext, useRef } from "react";
import { GraphDataContext } from "@/context/graph-data-context";

import { hierarchy } from "d3-hierarchy";

const QueryForm = () => {
  const {
    setTopicQID: setTopicQID,
    nodes: nodes,
    fetchGraphData: fetchGraphData,
  } = useContext(GraphDataContext);
  const [searchBoxIsFocused, setSearchBoxIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  console.log(nodes);
  const [searchOptions, setSearchOptions] = useState(nodes);
  const [searchOptionItems, setSearchOptionItems] = useState(nodes);
  const [prevSearchOptions, setPrevSearchOptions] = useState(nodes);

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

    const li = event.target.closest("li");
    const { qid, value, aliases, label, description, uri, url, pageid } =
      li.dataset;
    setTopicQID(qid);
    setInputValue(value);
    setSearchBoxIsFocused(false);
    fetchGraphData(qid);
  }

  return (
    <div className="flex w-full justify-center z-20">
      <form className="relative w-full justify-center z-20">
        <input
          type="text"
          placeholder="Search..."
          value={inputValue}
          onChange={handleSearchInput}
          onFocus={() => setSearchBoxIsFocused(true)}
          onBlur={() => setSearchBoxIsFocused(false)}
          className="w-full px-4 py-2 text-gray-200 placeholder:text-gray-200 bg-inherit border border-indigo-500 border-2 rounded-md focus:outline-none focus:border-indigo-300"
        />
        <div
          ref={searchBoxDropdownRef}
          className={
            searchBoxIsFocused
              ? "absolute top-12 overflow-y-auto h-96 rounded-md border border-indigo-300"
              : "hidden"
          }
        >
          <ul className="divide-indigo-300 divide-y">
            {nodes !== undefined && searchBoxIsFocused
              ? nodes.map((node, index) => {
                  const item = node.data;
                  return (
                    <li
                      key={index}
                      className="px-4 py-2 bg-indigo-500 cursor-pointer hover:bg-indigo-600"
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
                      <span className="font-bold text-gray-200">
                        {item.value}
                      </span>
                      <p className="text-gray-200">{item.description}</p>
                    </li>
                  );
                })
              : null}
          </ul>
        </div>
      </form>
    </div>
  );
};

export default QueryForm;
