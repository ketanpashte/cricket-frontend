import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import PartnershipCard from "./PartnershipCard";
import { PartnershipDto } from "../../../api/ball_user/types";

interface Props {
  partnerships: PartnershipDto[];
}

const PartnershipsAccordion: React.FC<Props> = ({ partnerships }) => (
  <Accordion defaultExpanded>
    <AccordionSummary expandIcon={<ExpandMore />}>
      <Typography fontWeight="bold">Partnerships</Typography>
    </AccordionSummary>
    <AccordionDetails>
      {partnerships?.map((p, i) => (
        <PartnershipCard key={i} partnership={p} />
      ))}
    </AccordionDetails>
  </Accordion>
);

export default PartnershipsAccordion;
