import React from "react";
import { Input, InputGroup } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";

export const Search = ({
    query,
    handleSearchChange,
}: {
    query: string,
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
}) => {

    return (
        <InputGroup
            maxW="300px"
            borderRadius="md"
            bg="white"
            borderWidth="1px"
            borderColor="blue.400"
            startElement={
                <LuSearch color="primary" cursor="pointer" />
            }
        >
            <Input
                size="md"
                placeholder="Search..."
                value={query}
                onChange={handleSearchChange}
            />
        </InputGroup>
    );
};
