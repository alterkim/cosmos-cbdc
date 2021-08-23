package dpnm

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/simsim/dpnm/x/dpnm/keeper"
	"github.com/simsim/dpnm/x/dpnm/types"
)

// InitGenesis initializes the capability module's state from a provided genesis
// state.
func InitGenesis(ctx sdk.Context, k keeper.Keeper, genState types.GenesisState) {
	// this line is used by starport scaffolding # genesis/module/init
	// Set all the cbdc
	for _, elem := range genState.CbdcList {
		k.SetCbdc(ctx, *elem)
	}

	// Set cbdc count
	k.SetCbdcCount(ctx, int64(len(genState.CbdcList)))

}

// ExportGenesis returns the capability module's exported genesis.
func ExportGenesis(ctx sdk.Context, k keeper.Keeper) *types.GenesisState {
	genesis := types.DefaultGenesis()

	// this line is used by starport scaffolding # genesis/module/export
	// Get all cbdc
	cbdcList := k.GetAllCbdc(ctx)
	for _, elem := range cbdcList {
		elem := elem
		genesis.CbdcList = append(genesis.CbdcList, &elem)
	}

	return genesis
}
