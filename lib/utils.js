import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function mapNodesToSearchOptions(nodes) {
  return nodes.map((node) => {
    const { qid, label, aliases, description, url, uri, pageId, repository } =
      node.data;

    return {
      qid,
      value: label,
      aliases,
      label,
      description,
      url,
      uri,
      pageId,
      repository,
    };
  });
}
