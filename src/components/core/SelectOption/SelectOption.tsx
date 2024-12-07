import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { ListCollection } from "@chakra-ui/react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

interface ISelectOptionProps {
  field: ControllerRenderProps<FieldValues, string>;
  list: ListCollection;
  defaultMessage?: string;
}

export default function SelectOption({ field, list, defaultMessage }: ISelectOptionProps) {
  return (
    <SelectRoot
      name={field.name}
      defaultValue={[field.value]}
      onValueChange={({value}) => field.onChange(value)}
      onInteractOutside={field.onBlur}
      collection={list}
    >
      <SelectTrigger cursor="pointer">
        <SelectValueText placeholder={defaultMessage} />
      </SelectTrigger>
      <SelectContent zIndex={1500}>
        {list.items.map((type) => (
          <SelectItem
            key={type.value}
            item={type}
          >
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
}
