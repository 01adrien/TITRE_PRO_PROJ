import React, { useState } from "react";
import Layout from "../components/Layout";
import UserProfile from "../components/UserProfile";
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { user } from "../store/user";

export default function User() {
  const [profile, setProfile] = useRecoilState(user);
  const [activeHeading, setActiveHeading] = useState("Details du compte");
  const navigate = useNavigate();
  const disconnect = () => {
    logout(user);
    setProfile({ default: "user" });
    navigate("/");
  };
  const UserHeadings = {
    "Reservation a venir": "mes rervations a venir",
    "Reservation passes": "mes rervations passees",
    "Details du compte": <UserProfile />,
    Deconnexion: "",
  };

  const ownerHeadings = {
    "Mes instruments": "mes instruments",
    "Reservation a venir": "mes rervations a venir",
    "Reservation passes": "mes rervations passees",
    "Details du compte": <UserProfile />,
    Deconnexion: "",
  };

  const adminHeadings = {
    Utilisateurs: "tous les utilisateurs",
    Reservations: "toutes les reservations",
    Instruments: "tous les instruments",
    Planning: "planning",
    "Details du compte": <UserProfile />,
    Deconnexion: "",
  };

  let headings = {};
  if (profile?.role === "user") headings = UserHeadings;
  if (profile?.role === "owner") headings = ownerHeadings;
  if (profile?.role === "admin") headings = adminHeadings;

  return (
    <Layout>
      <div className="w-full h-[80vh] flex justify-center">
        <div className=" w-[85%] h-full">
          <div className="h-24 flex items-center">
            <p className="text-[1.8em] font-bold">Mon compte</p>
          </div>
          <div className="flex justify-around w-[100%] h-[70%]">
            <div className="flex flex-col border-r-2 border-border_color h-[100%] w-[25%]">
              <div className="h-14 w-[80%] flex justify-start items-center border-b-2">
                <p className="text-[1.2em] pl-5"> MON COMPTE</p>
              </div>
              {Object.keys(headings).map((head) => {
                return (
                  <div
                    key={head}
                    onClick={() => {
                      head === "Deconnexion"
                        ? disconnect()
                        : setActiveHeading(head);
                    }}
                    className={`h-10 w-[80%] flex hover:bg-slate-200 ${
                      activeHeading === head && "bg-slate-200"
                    } cursor-pointer justify-start items-center`}
                  >
                    <p className="pl-5">{head}</p>
                  </div>
                );
              })}
            </div>
            <div className=" w-[100%]">
              <div>{headings[activeHeading]}</div>
            </div>
          </div>
        </div>
      </div>
      <p>{JSON.stringify(profile)}</p>
    </Layout>
  );
}
