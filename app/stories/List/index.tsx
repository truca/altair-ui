import { SectionsHash } from "@/app/components";
import { useQuery } from "@apollo/client";
import { HStack, VStack, StackProps } from "@chakra-ui/react";
import { compose } from "@reduxjs/toolkit";
import { DocumentNode } from "graphql";
import _ from "lodash";

export interface ListProps<Item> extends StackProps {
  type: "horizontal" | "vertical";
  items: Item[];
  itemProps?: any;
  itemMap?: (item: Item) => any;
  component: string | React.FunctionComponent<Item & { key: string | number }>;
}

export function List<Item>(props: ListProps<Item>) {
  const { type, children, items, component, itemProps, ...extraProps } = props;
  const ItemComponent =
    typeof component === "string" ? SectionsHash[component] : component;

  console.log({ ItemComponent });

  if (type === "horizontal") {
    return (
      <HStack gap={2} {...extraProps}>
        {items?.map((item: Item) => (
          <ItemComponent key={(item as any).id} {...item} {...itemProps} />
        ))}
      </HStack>
    );
  }

  return (
    <VStack w="100%" gap={2} {...extraProps}>
      {items?.map((item: Item) => (
        <ItemComponent key={(item as any).id} {...item} {...itemProps} />
      ))}
    </VStack>
  );
}

interface QueryListProps<Item> extends Omit<ListProps<Item>, "items"> {
  query: DocumentNode;
  variables?: any;
  // example: "me.favoriteCards"
  itemsSelector: string;
}

export function QueryList<Item>(props: QueryListProps<Item>) {
  const { query, variables } = props;
  const { error, loading, data } = useQuery(
    query,
    variables ? { variables } : undefined
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const items = _.get(data, props.itemsSelector);
  const itemsMapped = props.itemMap ? items.map(props.itemMap) : items;
  return <List {...props} items={itemsMapped} itemProps={props.itemProps} />;
}
