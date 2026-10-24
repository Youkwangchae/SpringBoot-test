package com.example.lostitems.repository;

import com.example.lostitems.domain.LostItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LostItemRepository extends JpaRepository<LostItem, Long> {

	List<LostItem> findByBuilding(String building);
}
