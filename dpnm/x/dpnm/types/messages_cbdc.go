package types

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

var _ sdk.Msg = &MsgCreateCbdc{}

func NewMsgCreateCbdc(creator string) *MsgCreateCbdc {
	return &MsgCreateCbdc{
		Creator: creator,
	}
}

func (msg *MsgCreateCbdc) Route() string {
	return RouterKey
}

func (msg *MsgCreateCbdc) Type() string {
	return "CreateCbdc"
}

func (msg *MsgCreateCbdc) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgCreateCbdc) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgCreateCbdc) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}

var _ sdk.Msg = &MsgUpdateCbdc{}

func NewMsgUpdateCbdc(creator string, id string) *MsgUpdateCbdc {
	return &MsgUpdateCbdc{
		Id:      id,
		Creator: creator,
	}
}

func (msg *MsgUpdateCbdc) Route() string {
	return RouterKey
}

func (msg *MsgUpdateCbdc) Type() string {
	return "UpdateCbdc"
}

func (msg *MsgUpdateCbdc) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgUpdateCbdc) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgUpdateCbdc) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}

var _ sdk.Msg = &MsgCreateCbdc{}

func NewMsgDeleteCbdc(creator string, id string) *MsgDeleteCbdc {
	return &MsgDeleteCbdc{
		Id:      id,
		Creator: creator,
	}
}
func (msg *MsgDeleteCbdc) Route() string {
	return RouterKey
}

func (msg *MsgDeleteCbdc) Type() string {
	return "DeleteCbdc"
}

func (msg *MsgDeleteCbdc) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgDeleteCbdc) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgDeleteCbdc) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
