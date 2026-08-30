import { ListBlock as ListBlockType, ListItem } from "@/types/blocks";
import InlineRenderer from "./InlineRenderer";

export default function ListBlock({
    style,
    items,
}: ListBlockType) {
    switch (style) {
        case "bullet":
            return (
                <ul>
                    <ListItems items={items} />
                </ul>
            );

        case "numbered":
            return (
                <ol>
                    <ListItems items={items} />
                </ol>
            );

        case "definition":
            return (
                <dl>
                    {items.map((item, i) => (
                        <div key={i}>
                            {item.term && (
                                <dt>
                                    <InlineRenderer content={item.term} />
                                </dt>
                            )}

                            <dd>
                                <InlineRenderer content={item.content} />

                                {item.children && (
                                    // Nested list style is not retained by the contract,
                                    // so use the same bullet fallback as other nested items.
                                    <ul>
                                        <ListItems items={item.children} />
                                    </ul>
                                )}
                            </dd>
                        </div>
                    ))}
                </dl>
            );
    }
}

function ListItems({ items }: { items: ListItem[] }) {
    return (
        <>
            {items.map((item, i) => (
                <li key={i}>
                    <InlineRenderer content={item.content} />

                    {item.children && (
                        // Contract does not preserve nested list style,
                        // default to bullet list for nested children.
                        <ul>
                            <ListItems items={item.children} />
                        </ul>
                    )}
                </li>
            ))}
        </>
    );
}
